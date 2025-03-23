import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Using Router and Routes in v6
import Auth from "./Auth";
import FaqForm from "./components/faqForm";
import Dashboard from "./components/dashboard";
import ModuleChecker from "./components/erp";
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
    <Route path ="/update" element={<FaqForm></FaqForm>}/>
    <Route path ="/dash" element={<Dashboard></Dashboard>}/>
    <Route path ="/erp" element={<ModuleChecker></ModuleChecker>}/>
      
    </Routes>
  </Router>
  );
};

export default App;
