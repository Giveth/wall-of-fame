import firebase from "firebase";

var config = {
  databaseURL: "https://givethvideowalloffame.firebaseio.com",
  projectId: "givethvideowalloffame",
  storageBucket: "givethvideowalloffame.appspot.com",
};

export default () => {
  // Next.js firebase bug workaround when in development
  !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
};
