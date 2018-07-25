const express = require('express')
const path = require('path')
const url = require('url')
const next = require('next')
const web3 = require('web3')
const sigUtil = require('eth-sig-util')
const moment = require('moment')
const UUID = require("uuid-v4");

const routes = require('./routes')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = routes.getRequestHandler(app)

const i18nextMiddleware = require('i18next-express-middleware')
const Backend = require('i18next-node-fs-backend')
const { i18nInstance } = require('./i18n')

const admin = require("firebase-admin")

const serviceAccount = require("./privateKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://givethvideowalloffame.firebaseio.com",
  storageBucket: "givethvideowalloffame.appspot.com",
});

var db = admin.database();
var bucket = admin.storage().bucket();

// init i18next with serverside settings
// using i18next-express-middleware
i18nInstance
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    load: 'languageOnly',
    preload: ['en', 'de'], // preload all langages
    ns: ['common', 'navigation'], // need to preload all the namespaces
    backend: {
      loadPath: path.join(__dirname, '/locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(__dirname, '/locales/{{lng}}/{{ns}}.missing.json')
    }
  }, () => {
    // loaded translations we can bootstrap our routes
    app.prepare()
      .then(() => {
        const server = express()

        // enable middleware for i18next
        server.use(i18nextMiddleware.handle(i18nInstance))

        // serve general static files
        server.use('/static', express.static(path.join(__dirname, '/static')))

        // serve locales for client
        server.use('/locales', express.static(path.join(__dirname, '/locales')))

        // missing keys
        server.post('/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18nInstance))

        server.get('/api/delete', (req, res) => {
          const { videoId, signedMsg } = req.query
          // TODO: Refactor into real authentication scheme with sessions
          const validAddress = sigUtil.recoverPersonalSignature({
            data: web3.utils.utf8ToHex(videoId),
            sig: signedMsg,
          })

          const ref = db.ref("GVWOF_v2/" + videoId);
          ref.once("value", async (snapshot) => {
            const { wallet, src, timestamp } = snapshot.val()
            const olderThanOneDay = !!moment().diff(moment(timestamp), 'days')
            if (!olderThanOneDay && validAddress === wallet.toLowerCase()) {
              let filePath = decodeURIComponent(src).split('https://firebasestorage.googleapis.com/v0/b/givethvideowalloffame.appspot.com/o/')[1]
              filePath = filePath.split(url.parse(src).search)[0]

              const file = bucket.file(filePath);
              const exists = await file.exists();

              if (exists) {
                await file.delete() // delete video from storage
                await ref.set(null) // delete info from realtime database
                res.status(200).end()
              }
            }
            res.status(404).end()
          });
        })

        server.post('/api/upload', function (req, res, next) {
          const { wallet, signedMsg, title, description, social, category, fileType } = req.query

          // TODO: Refactor into real authentication scheme with sessions
          const validAddress = sigUtil.recoverPersonalSignature({
            data: wallet,
            sig: signedMsg,
          })

          const uuid = UUID()
          const week = moment().format("WW_MM_YYYY")
          const timestamp = new Date().getTime()
          const path = 'GVWOF_v2/' + week + '/' + title

          if (validAddress === wallet.toLowerCase()) {
            const file = bucket.file('/' + path);
            req.pipe(file.createWriteStream({
              contentType: fileType,
              metadata: {
                firebaseStorageDownloadTokens: uuid,
              }
            }))
            req.on('error', () => res.status(404).end());
            req.on('end', () => {
              const src = 'https://firebasestorage.googleapis.com/v0/b/givethvideowalloffame.appspot.com/o/' + encodeURIComponent(path) + '?alt=media&token=' + uuid
              const ref = db.ref("GVWOF_v2");

              ref.push({
                src,
                title,
                description,
                type: fileType,
                timestamp,
                week,
                wall: category,
                social,
                wallet: validAddress,
              })

              res.status(200).end()
            });
          } else {
            res.status(404).end()
          }
        });

        // use next.js
        server.get('*', (req, res) => handle(req, res))

        server.listen(3000, (err) => {
          if (err) throw err
          console.log('> Ready on http://localhost:3000')
        })
      })
  })
