import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGd6vdTeSkrdUpCYGb9b9w0ZnXYtagjzQ",
  authDomain: "lastexam-82cd2.firebaseapp.com",
  projectId: "lastexam-82cd2",
  storageBucket: "lastexam-82cd2.appspot.com",
  messagingSenderId: "699440627814",
  appId: "1:699440627814:web:9674ebf0c8541af2a0eda7",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
