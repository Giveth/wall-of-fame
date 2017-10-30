import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import firebase from 'firebase';
import { isMobile } from '../lib/platformChecker'

// components
import MainMenu from './../components/MainMenu'

// views
import VideoWallOfFame from './../components/views/VideoWallOfFame.js'
//import CampaignsVideosViewer from './../components/views/CampaignsVideosViewer.js'
import MediaCaptureiOS from './../components/views/MediaCapture_iOS.js'
import MediaCaptureWeb from './../components/views/MediaCapture_Web.js'

var config = {
  apiKey: "AIzaSyAGO0q7WjakjW2vNyxIVThAVPWxm-xozj8",
  authDomain: "givethvideowalloffame.firebaseapp.com",
  databaseURL: "https://givethvideowalloffame.firebaseio.com",
  projectId: "givethvideowalloffame",
  storageBucket: "givethvideowalloffame.appspot.com",
  messagingSenderId: "271393366127"
};
firebase.initializeApp(config);

class Application extends Component {
  render() {
    return (
      <Router basename="/GivethVWOF_v2">
        <div>
          <MainMenu />
          <div>
            {/* Routes are defined here. Persistent data is set as props on components */}
            <Switch>
              {
                isMobile.any() ?
                  (
                    <Route exact path="/new/:week/:wall?" component={(props) => (<MediaCaptureiOS appState={'value'} isNew={true} {...props} />)} />
                  ) : (
                    <Route exact path="/new/:week/:wall?" component={(props) => (<MediaCaptureWeb appState={'value'} isNew={true} {...props} />)} />
                  )
              }
              <Route exact path="/" component={(props) => (<VideoWallOfFame {...props} />)} />
              <Route exact path="/:wall" component={(props) => (<VideoWallOfFame {...props} />)} />
              <Route exact path="/:wall/:week" component={(props) => (<VideoWallOfFame {...props} />)} />


              {/* <Route exact path="/:week" component={VideoWallOfFame} />
              {
                isMobile.any() ?
                  (
                    <Route exact path="/new/:week" component={(props) => (MediaCaptureiOS appState={'value'} isNew={true} {...props} />)} />
                  ) : (
                    <Route exact path="/new/:week" component={(props) => (<MediaCaptureWeb appState={'value'} isNew={true} {...props} />)} />
                  )
              }
              isMobile.any() ?
                (
                  <Route exact path="/new" component={(props) => (<MediaCaptureiOS appState={'value'} isNew={true} {...props} />)} />
              ) : (
                  <Route exact path="/new" component={(props) => (<MediaCaptureWeb appState={'value'} isNew={true} {...props} />)} />
              )
              }
              <Route exact path="/view/:week/:id/" component={CampaignsVideosViewer} /> */}

            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default Application;
