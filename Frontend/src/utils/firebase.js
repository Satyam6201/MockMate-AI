import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY || "AIzaSyAFtVa6wkelACvAv5lLIZ5tAFsqGYSrSGs",
  authDomain: "mockmate-ai-53a47.firebaseapp.com",
  projectId: "mockmate-ai-53a47",
  storageBucket: "mockmate-ai-53a47.firebasestorage.app",
  messagingSenderId: "251670574155",
  appId: "1:251670574155:web:802892f049abb0c70dc9ce"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, provider } 