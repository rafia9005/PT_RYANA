import React, { useState } from "react";
import { sendPasswordResetEmail, getAuth } from "firebase/auth"; // Import modul yang diperlukan
import app from "@/lib/firebase";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const auth = getAuth(app); // Inisialisasi objek auth menggunakan objek app
      await sendPasswordResetEmail(auth, email); // Gunakan objek auth yang diinisialisasi
      setMessage(
        "Email reset password telah dikirim. Silakan periksa kotak masuk Anda."
      );
    } catch (error) {
      setMessage("Terjadi kesalahan. Silakan coba lagi.");
      console.error("Reset password error:", error);
    }
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email address</label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              onChange={handleEmailChange}
            />
          </div>
        </div>

        <div>
          <button type="submit">Forget Password</button>
        </div>
      </form>
      {message && (
        <p className="text-center text-md mt-3 text-gray-900">{message}</p>
      )}
    </>
  );
};

export default ForgetPassword;
