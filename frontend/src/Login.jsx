import React, { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Logging in with:", email, password);
    } else {
      console.log("Signing up with:", email, password, confirmPassword);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 via-black to-black">
      <div className="bg-white/10 p-6 rounded-lg backdrop-blur-md text-center text-white w-80">
        <h2 className="text-2xl font-bold mb-4">{isLogin ? "Login" : "Signup"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded border-none outline-none text-black"
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded border-none outline-none text-black"
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 rounded border-none outline-none text-black"
            />
          )}
          <button
            type="submit"
            className="w-full p-2 rounded bg-blue-600 hover:bg-blue-800 text-white cursor-pointer"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>
        <p
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 cursor-pointer text-blue-300 underline"
        >
          {isLogin
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
