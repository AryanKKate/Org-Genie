import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useNavigate } from 'react-router-dom';


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


const firebaseConfig = {
  apiKey: "AIzaSyCXzwnR_kqLsZ1YRK0oXOPaURiXTFetMBk",
  authDomain: "hackai-99db0.firebaseapp.com",
  projectId: "hackai-99db0",
  storageBucket: "hackai-99db0.firebasestorage.app",
  messagingSenderId: "356028608342",
  appId: "1:356028608342:web:23091f9890c7afe58f30f7",
  measurementId: "G-1STPMCQLKP"
};

// Initialize Firebase
const app1 = initializeApp(firebaseConfig);
const analytics = getAnalytics(app1);



  const navigate = useNavigate();

  const navigateToAbout = () => {
    navigate('/dashboard');
  };

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
        background:
          "linear-gradient(to bottom, #000000 0%, #0A0A33 50%, #1D1D80 70%, #2d50ff 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          backdropFilter: "blur(10px)",
          textAlign: "center",
          color: "#fff",
          width: "350px",
          padding: "20px 80px 20px 60px",
        }}
      >
        <h2>{isLogin ? "Login" : "Signup"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              color: "black",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "none",
            }}
          />
          <input
          id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              color: "black",
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
           id="login/submit"
            type="submit"
            style={{
              width: "105.7%",
              padding: "10px",
              borderRadius: "5px",
              background: "#2d50ff",
              color: "black",
              border: "none",
              cursor: "pointer",
            }}

            onClick={()=> {
              console.log("Log")
              const auth = getAuth();
              var emailinput=document.getElementById('email').value;
              var passwordinput=document.getElementById('password').value;

               createUserWithEmailAndPassword(auth, emailinput, passwordinput)
                .then((userCredential) => {
                  // Signed up 
                  const user = userCredential.user;
                  console.log(user);
             
                  // ...
                  navigateToAbout(); 

                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  console.log(errorCode, errorMessage);
                  // ..
                });
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