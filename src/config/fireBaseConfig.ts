
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxD6R8t1oF0G4seOfkckodDPGkfxfAu1o",
  authDomain: "my-marketplace-63024.firebaseapp.com",
  projectId: "my-marketplace-63024",
  storageBucket: "my-marketplace-63024.appspot.com",
  messagingSenderId: "811527708024",
  appId: "1:811527708024:web:9b4efd22bc97ff0da5bc8d",
  measurementId: "G-N2LV13ZXB9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

