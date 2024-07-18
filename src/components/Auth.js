"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // Handle error (e.g., show a toast message)
    }
  };

  return (
    <div className="auth-container">
      <h1>{isRegistering ? "Register" : "Sign In"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isRegistering ? "Register" : "Sign In"}</button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Switch to Sign In" : "Switch to Register"}
      </button>
    </div>
  );
}
