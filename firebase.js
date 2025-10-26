// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Direct Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA416XOHOVsE2ZpMZmKes_qcR-MsXqgt5M",
  authDomain: "you-query.firebaseapp.com",
  projectId: "you-query",
  storageBucket: "you-query.appspot.com",
  messagingSenderId: "614442013421",
  appId: "1:614442013421:web:793519986a762bb8ccf2e4",
  measurementId: "G-1DMTVBLQDZ"
};

console.log("Firebase Config Loaded:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (browser only)
let analytics = null;

if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized successfully");
    }
  }).catch(error => {
    console.error("Firebase Analytics initialization error:", error);
  });
}

export { analytics };

console.log("Firebase initialized successfully");
