import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }
  render () {
    return (
      <html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Charitable giving on the blockchain - revolution.eth" />
          <title>Giveth Video Wall of Fame</title>
          <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css" />
          <link href="https://fonts.googleapis.com/css?family=Quicksand:200,300,400,700" rel="stylesheet" />
          <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
          {this.props.styleTags}
        </Head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <Main />
          <NextScript />
          <script src="https://cdn.webrtc-experiment.com/MultiStreamsMixer.js"></script>
          <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
          <script src="https://cdn.webrtc-experiment.com/getScreenId.js"></script>
          {/* <script src="https://cdn.webrtc-experiment.com/FileSelector.js"></script> */}
          <script src="https://cdn.webrtc-experiment.com/RecordRTC.js"></script>
          {/* <script src="https://cdn.webrtc-experiment.com/getHTMLMediaElement.js"></script> */}
        </body>
      </html>
    )
  }
}
