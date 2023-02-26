// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth, GoogleAuthProvider, googleAuthProvider } from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuH7BtJEqOp9aSV7Qkj1GK6xyYg1sDwlc",
  authDomain: "kabai-lab-choice-1bc18.firebaseapp.com",
  projectId: "kabai-lab-choice-1bc18",
  storageBucket: "kabai-lab-choice-1bc18.appspot.com",
  messagingSenderId: "812925400505",
  appId: "1:812925400505:web:a7943bbc2d08b83aabb268",
  measurementId: "G-39VJ8418NP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// https://zenn.dev/e_chan1007/articles/8528c1d14a312a
// provider.setCustomParameters({
//     "hd": "dc.tohoku.ac.jp",
//   });

const db = getFirestore(app);

export { auth, provider, db };