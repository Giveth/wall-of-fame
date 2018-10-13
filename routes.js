const routes = (module.exports = require('next-routes')())

routes.add('/month/:month', 'index')

routes.add('/GivethVWOF_v2', 'index')
routes.add('/GivethVWOF_v2/:month', 'index')

routes.add('/view', 'view')
routes.add('/view/:id', 'view')

routes.add('/upload', 'upload')
