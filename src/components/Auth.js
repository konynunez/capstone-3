"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "react-hot-toast";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        debugger;
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Registration successful");
      } else {
        debugger;
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Sign in successful");
      }
    } catch (error) {
      debugger;
      console.error("Authentication error:", error);
      toast.error("Authentication error");
    }
  };

  return (
    <div className="auth-container flex justify-center items-center h-full">
      <div className="bg-gray-700 p-10">
        <h1 className="text-2xl text-white mb-5">
          {isRegistering ? "Register" : "Sign In"}
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 py-3 px-4 mb-2 block focus:outline-none w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 py-3 px-4 mb-2 block focus:outline-none w-full"
          />
          <button
            type="submit"
            className="bg-green-500hover:bg-green-400 px-4 py-2 rounded-sm mb-2 w-full"
          >
            {isRegistering ? "Register" : "Sign In"}
          </button>
        </form>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-blue-500 hover:underline"
        >
          {isRegistering ? "Switch to Sign In" : "Switch to Register"}
        </button>
      </div>
    </div>
  );
}

            
