
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyChP4kpdMnYU9bsMQyVfHNkyRlOV5mlohM",
    authDomain: "project-1072483501278534865.firebaseapp.com",
    projectId: "project-1072483501278534865",
    storageBucket: "project-1072483501278534865.firebasestorage.app",
    messagingSenderId: "759515389839",
    appId: "1:759515389839:web:ecf63f1e05fe3f7c87f5fa",
    measurementId: "G-JX76NYS85M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { auth, analytics };