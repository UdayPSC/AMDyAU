import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYxaD_wSrsNO8pPGytAvlCxykh_Ys95KE",
  authDomain: "amdyau-a3352.firebaseapp.com",
  projectId: "amdyau-a3352",
  storageBucket: "amdyau-a3352.firebasestorage.app",
  messagingSenderId: "569632861188",
  appId: "1:569632861188:web:3e1a8760300e6df46d1951",
  measurementId: "G-4HQN8WX74D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
// Initialize Firestore
export const db = getFirestore(app);
export { firestore };