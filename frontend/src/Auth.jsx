"use client"

import { useState } from "react"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { useNavigate } from "react-router-dom"
import { LogIn, UserPlus } from "lucide-react"
import logo from "./assets/logo.png"

export let admin = ""

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const firebaseConfig = {
    apiKey: "AIzaSyCXzwnR_kqLsZ1YRK0oXOPaURiXTFetMBk",
    authDomain: "hackai-99db0.firebaseapp.com",
    projectId: "hackai-99db0",
    storageBucket: "hackai-99db0.firebasestorage.app",
    messagingSenderId: "356028608342",
    appId: "1:356028608342:web:23091f9890c7afe58f30f7",
    measurementId: "G-1STPMCQLKP",
  }

  // Initialize Firebase
  const app1 = initializeApp(firebaseConfig)
  const analytics = getAnalytics(app1)

  const navigate = useNavigate()

  const navigateToAbout = () => {
    navigate("/dashboard")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) {
      console.log("Logging in with:", email, password)
    } else {
      console.log("Signing up with:", email, password, confirmPassword)
    }
  }

  const handleAuth = () => {
    if (isLogin) {
      const emailInput = document.getElementById("email").value
      const passwordInput = document.getElementById("password").value
      const auth = getAuth()
      signInWithEmailAndPassword(auth, emailInput, passwordInput)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user
          console.log(user.email)
          admin = user.email
          navigateToAbout()
        })
        .catch((error) => {
          console.error(error.code, error.message)
        })
    } else {
      const auth = getAuth()
      const emailInput = document.getElementById("email").value
      const passwordInput = document.getElementById("password").value

      createUserWithEmailAndPassword(auth, emailInput, passwordInput)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user
          console.log(user.email)
        })
        .catch((error) => {
          console.error(error.code, error.message)
        })
    }
  }

  return (
    <div
      className="min-h-screen flex justify-center items-center font-sans"
      style={{
        backgroundImage: `url(https://static.wixstatic.com/media/8dd0e1_ddc836d7b97d4aa986a5035d709531b9~mv2.png/v1/fill/w_902,h_640,al_c,q_90,enc_avif,quality_auto/8dd0e1_ddc836d7b97d4aa986a5035d709531b9~mv2.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className=" w-full max-w-md p-8 mx-4 bg-blue-700 backdrop-blur-lg rounded-xl shadow-lg text-center">
        {/* Logo in top left */}
        <div className="absolute top-6 left-6">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-white mt-4">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-blue-100 border border-blue-300 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div className="relative">
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-blue-100 border border-blue-300 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-blue-100 border border-blue-300 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          )}

          <button
            id="login/submit"
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2"
            onClick={handleAuth}
          >
            {isLogin ? (
              <>
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-blue-100 hover:text-white cursor-pointer transition"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </p>
      </div>
    </div>
  )
}

export default Auth
