import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvL19_FB_9wAQfsSE98xETaAxSY0QaRPc",
  authDomain: "rentathing-chat.firebaseapp.com",
  projectId: "rentathing-chat",
  storageBucket: "rentathing-chat.firebasestorage.app",
  messagingSenderId: "46925933993",
  appId: "1:46925933993:web:2655e6d02386cd0681a8b8",
  measurementId: "G-FR374Y094T"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);