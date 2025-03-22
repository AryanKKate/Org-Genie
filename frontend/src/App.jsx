import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Using Router and Routes in v6
import Auth from "./Auth";
// Assuming you have a NewScreen component

const App = () => {
 

  return (
    <Router>  {/* This is the context provider for React Router hooks */}
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/dashboard" element={
        <div className="flex animate-fadeIn duration-1000">
        <Sidebar />
     
     
        <MainContent />
    
        
      </div>
                            
                                   
    } />
      
    </Routes>
  </Router>
  );
};

export default App;
