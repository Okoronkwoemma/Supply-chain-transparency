import { auth, db } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// This variable holds the "Active User" details (Wallet + Role)
export let currentUserSession = null;

// --- STEP 2: REGISTER ---
export async function registerUser(email, password, ganacheAddress, role) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save mapping to Firestore
    await setDoc(doc(db, "users", user.uid), {
        email: email,
        walletAddress: ganacheAddress,
        role: role,
        uid: user.uid
    });
    return user;
}

// --- STEP 3: LOGIN ---
export async function loginUser(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Pull the Wallet and Role from Firestore
    const docSnap = await getDoc(doc(db, "users", userCredential.user.uid));

    if (docSnap.exists()) {
        currentUserSession = docSnap.data();
        console.log("Session Loaded:", currentUserSession);
        return currentUserSession;
    }
}

// --- STEP 4: ACCESSOR ---
// Use this function in your blockchain.js to know which address to send from
export function getActiveWallet() {
    return currentUserSession ? currentUserSession.walletAddress : null;
}