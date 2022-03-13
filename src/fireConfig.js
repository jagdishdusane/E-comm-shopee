import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5ICEXsOMvpGt2AwGGBBCw0yvZjalCXw4",
  authDomain: "e-comm-shopee.firebaseapp.com",
  projectId: "e-comm-shopee",
  storageBucket: "e-comm-shopee.appspot.com",
  messagingSenderId: "896351273956",
  appId: "1:896351273956:web:e606000ba9cf050f7e7df1",
  measurementId: "G-YT7K43FTWL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);

export default fireDB;
