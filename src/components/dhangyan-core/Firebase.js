// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHCfDXfV0K4k6aqmq959fxqSiINZRpxsI",
    authDomain: "dhyaangyan.firebaseapp.com",
    projectId: "dhyaangyan",
    storageBucket: "dhyaangyan.appspot.com",
    messagingSenderId: "242621798985",
    appId: "1:242621798985:web:9a7d95ce5d11ec3ab1fd98",
    measurementId: "G-PQ4Y0C81CN"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);