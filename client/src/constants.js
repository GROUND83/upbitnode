import firebase from "firebase";
import "firebase/firestore";
const config = {
  apiKey: "AIzaSyC3w5mB1lT6GFGW7LMjAITL9ySMkaab2W0",
  authDomain: "upbitnode.firebaseapp.com",
  projectId: "upbitnode",
  storageBucket: "upbitnode.appspot.com",
  messagingSenderId: "1038958822569",
  appId: "1:1038958822569:web:2d68bbec42764a6f3e95b8",
  measurementId: "G-6VTY6S5VXM",
};

firebase.initializeApp(config);

export const store = firebase.firestore();
export const firebaseAuth = firebase.auth;
