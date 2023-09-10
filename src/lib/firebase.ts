import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBNjA6OuP_K7xOLulxzx5-hw7zLstvfYLM",
  authDomain: "rafii-ba8e2.firebaseapp.com",
  projectId: "rafii-ba8e2",
  storageBucket: "rafii-ba8e2.appspot.com",
  messagingSenderId: "524025757540",
  appId: "1:524025757540:web:367504e0d0b2a250a50471",
  measurementId: "G-D7ZCJG6KPJ"
};

const app = initializeApp(firebaseConfig);
if (typeof window !== "undefined") {
  const analytics = getAnalytics(app);
}

export default app;
