import React, { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle state
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
    <div
      style={{
        fontFamily: "'Raleway', sans-serif",
        background: "linear-gradient(90deg, #2d50ff, #000000, #000000)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "20px",
          borderRadius: "10px",
          backdropFilter: "blur(10px)",
          textAlign: "center",
          color: "#fff",
          width: "300px",
        }}
      >
        <h2>{isLogin ? "Login" : "Signup"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "none",
            }}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "none",
            }}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "none",
              }}
            />
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              background: "#2d50ff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>
        <p
          onClick={() => setIsLogin(!isLogin)}
          style={{
            marginTop: "10px",
            cursor: "pointer",
            color: "#2d50ff",
            textDecoration: "underline",
          }}
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
