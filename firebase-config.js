import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBBqx09jdXCginHoTNzEhtEtyzH-12iElc",
    authDomain: "supplychainauth-9c0e2.firebaseapp.com",
    projectId: "supplychainauth-9c0e2",
    storageBucket: "supplychainauth-9c0e2.firebasestorage.app",
    messagingSenderId: "29294227236",
    appId: "1:29294227236:web:4da83991eeafc8a7058db1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);