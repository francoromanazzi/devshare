import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Init firebase instance
firebase.initializeApp({
  apiKey: 'AIzaSyBXWk-Wpk1oNCkla_x4wQzScbkUotd7-G0',
  authDomain: 'devshare-8832f.firebaseapp.com',
  databaseURL: 'https://devshare-8832f.firebaseio.com',
  projectId: 'devshare-8832f',
  storageBucket: 'devshare-8832f.appspot.com',
  messagingSenderId: '722819155566'
});

// Init firestore
firebase.firestore();

export default firebase;
