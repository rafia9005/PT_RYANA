import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCfJamypbmJgZcEmgjoGPoQruBZ0h0GQpw",
  authDomain: "pt-ryana-asta-jaya.firebaseapp.com",
  projectId: "pt-ryana-asta-jaya",
  storageBucket: "pt-ryana-asta-jaya.appspot.com",
  messagingSenderId: "489186067565",
  appId: "1:489186067565:web:07e11663a5073c18c3eb64",
  measurementId: "G-QK8C31HLPS"
};

const app = initializeApp(firebaseConfig);
if (typeof window !== "undefined") {
  const analytics = getAnalytics(app);
}

export default app;
