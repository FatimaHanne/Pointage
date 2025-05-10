import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Remplacez par les informations de votre projet Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBp8IHX_ESbnYUjXAwoUt-i4MOLxO7Gg5M",  // Ta vraie clé API
    authDomain: "pointage-284ae.firebaseapp.com",  // ID du projet
    projectId: "pointage-284ae",  // ID du projet
    storageBucket: "pointage-284ae.appspot.com",  // ID du projet
    messagingSenderId: "475410510306",  // Numéro du projet
    appId: "1:475410510306:web:abcdef123456",  // App ID (reçoit des infos spécifiques à l'app)
  };
  

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services que vous utilisez
export const db = getFirestore(app);
export const auth = getAuth(app);
