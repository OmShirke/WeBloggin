let firebaseConfig = {
  apiKey: "AIzaSyBxfuNAn7aZWk3RP8ugyu5K90RbZZFYuX8",
  authDomain: "blogging-website-96863.firebaseapp.com",
  projectId: "blogging-website-96863",
  storageBucket: "blogging-website-96863.appspot.com",
  messagingSenderId: "55833933647",
  appId: "1:55833933647:web:ff2aae0347e7df5f93b73a",
};

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
