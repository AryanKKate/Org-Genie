import React from "react";
import ContextProvider from "./context/Context";
import MainContent from "./components/MainContent";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <ContextProvider>
      <div className="flex">
        <Sidebar />
        <MainContent />
      </div>
    </ContextProvider>
  );
};

export default App;