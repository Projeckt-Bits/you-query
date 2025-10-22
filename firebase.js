// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration object containing all necessary API keys and identifiers
const firebaseConfig = {
  apiKey: "AIzaSyA416XOHOVsE2ZpMZmKes_qcR-MsXqgt5M",
  authDomain: "you-query.firebaseapp.com",
  projectId: "you-query",
  storageBucket: "you-query.firebasestorage.app",
  messagingSenderId: "614442013421",
  appId: "1:614442013421:web:793519986a762bb8ccf2e4",
  measurementId: "G-1DMTVBLQDZ"
};

// Initialize Firebase
let app = null;
let analytics = null;

try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Re-throw the error to prevent the app from starting with broken Firebase
  throw error;
}

// Export the initialized app and analytics instances
export { app, analytics };
