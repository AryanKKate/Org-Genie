import React, { useState, useEffect } from "react";
import './MainContent.css';
import { fetchFAQs, sendQuery } from "./api";
import { FaUserCircle, FaMicrophone } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import botlogo from "../assets/logo.png";
import { admin } from "../Auth.jsx";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import user from "../assets/user.jpg";


const MainContent = () => {
  const [input, setInput] = useState('');
  const [recentPrompt, setRecentPrompt] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Fetch FAQs on component mount
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const data = await fetchFAQs();
        setFaqs(data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };
    loadFAQs();
  }, []);

  useEffect(() => {
    if (admin === '2022.aditya.mhatre@ves.ac.in') {
      console.log("Admin logged in:", admin);
    }
  }, []);

  // Handle query submission
  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setRecentPrompt(input);
    setShowResult(true);

    try {
      const response = await sendQuery(input);
      const result = response?.response || "No response received.";

      // Store chat in history with timestamp
      setChatHistory((prev) => [
        ...prev,
        { prompt: input, response: result, timestamp: new Date().toLocaleString() },
      ]);
      setResultData(result);
      
      // Read the response aloud
      speakResponse(result);
    } catch (error) {
      console.error("Error handling query:", error);
      setChatHistory((prev) => [
        ...prev,
        { prompt: input, response: "Failed to get a response.", timestamp: new Date().toLocaleString() },
      ]);
      setResultData("Failed to get a response.");
    }

    setLoading(false);
    setInput('');
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleCardClick = (query) => {
    // Directly submit the query from a card click
    setLoading(true);
    setShowResult(true);
  
    sendQuery(query)
      .then((response) => {
        const result = response?.response || "No response received.";
        setChatHistory((prev) => [
          ...prev,
          { prompt: query, response: result, timestamp: new Date().toLocaleString() },
        ]);
        setResultData(result);
        speakResponse(result);
      })
      .catch((error) => {
        console.error("Error handling query:", error);
        setChatHistory((prev) => [
          ...prev,
          { prompt: query, response: "Failed to get a response.", timestamp: new Date().toLocaleString() },
        ]);
        setResultData("Failed to get a response.");
      })
      .finally(() => {
        setLoading(false);
        setInput(''); // Optionally clear the input if used elsewhere.
      });
  };
  

  // Voice Input: Convert speech to text
  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
  };

  // Voice Output: Read bot's response aloud with a smooth female voice
  const speakResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    // Function to select and speak with a voice
    const speak = () => {
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = voices.find(voice => voice.name === "Google UK English Female");
      // Fallback if preferred voice isn't available
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.name.includes("Female")) || voices[0];
      }
      utterance.voice = selectedVoice;
      utterance.pitch = 1.1;  // Adjust for a smooth tone
      utterance.rate = 0.9;   // Adjust speaking speed

      window.speechSynthesis.speak(utterance);
    };

    // Check if voices are loaded; if not, wait for voiceschanged event
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = speak;
    } else {
      speak();
    }
  };

  return (
    <div className="main flex-1 min-h-screen pb-[15vh] relative">
      <div className="flex items-center justify-between text-xl p-5 text-slate-700">
  <div className="flex items-center gap-3">
    <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
    <p className="whitespace-nowrap">IDMS Genie</p>
  </div>
  {admin === '2022.aditya.mhatre@ves.ac.in' && (
  <div className="flex justify-end items-center gap-3">
    <Link to="/update">
      <button className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5">
        Update
      </button>
    </Link>
    <Link to="/dash">
      <button className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5">
        Dashboard
      </button>
    </Link>
    <Link to="/erp">
      <button className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5">
        ERP Data
      </button>
    </Link>
  </div>
  
)}

</div>



      {/* <div className="flex items-center justify-between text-xl p-5 text-slate-700">
        <p>Neural Search</p>
        {admin === '2022.aditya.mhatre@ves.ac.in' && (
          <div className="relative dropdown-container">
            <button 
              onClick={toggleDropdown}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Dropdown button 
              <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Upload PDF</a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Upload Image</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div> */}

      <div className="max-w-[900px] mx-auto">
        {/* Main Chat Section */}
        {!showResult ? (
         <>
         <div className="my-12 text-[56px] text-slate-500 font-semibold p-5">
           <p className="text-slate-400">How may I assist you?</p>
         </div>
         <div className="my-1 text-[20px] text-slate-500 font-semibold px-7">
           <p>Most Frequently Asked Questions</p>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
           <div
             className="h-[200px] p-4 rounded-lg relative cursor-pointer hover:bg-white-800"
             style={{ backgroundColor: 'rgba(37, 100, 235, 0.43)' }}
             onClick={() => handleCardClick("How does E-invoicing work in IDMS?")}
           >
             <p className="font-medium text-lg" style={{ color: "black" }}>
               How does E-invoicing work in IDMS?
             </p>
           </div>
           <div
             className="h-[200px] p-4 rounded-lg relative cursor-pointer hover:bg-gray-100"
             style={{ backgroundColor: 'rgba(37, 100, 235, 0.43)' }}
             onClick={() => handleCardClick("What are the different types of GST in IDMS?")}
           >
             <p className="font-medium text-lg" style={{ color: "black" }}>
               What are the different types of GST in IDMS?
             </p>
           </div>
           <div
             className="h-[200px] p-4 rounded-lg relative cursor-pointer hover:bg-gray-300"
             style={{ backgroundColor: 'rgba(37, 100, 235, 0.43)' }}
             onClick={() => handleCardClick("How does IDMS automate GST payments?")}
           >
             <p className="font-medium text-lg" style={{ color: "black" }}>
               How does IDMS automate GST payments?
             </p>
           </div>
           <div
             className="h-[200px] p-4 rounded-lg relative cursor-pointer hover:bg-gray-300"
             style={{ backgroundColor: 'rgba(37, 100, 235, 0.43)' }}
             onClick={() => handleCardClick("Can IDMS generate GST returns automatically?")}
           >
             <p className="font-medium text-lg" style={{ color: "black" }}>
               Can IDMS generate GST returns automatically?
             </p>
           </div>
         </div>
       </>
       

        ) : (
          <div className="py-0 px-[5%] max-h-[70vh] overflow-y-scroll scrollbar-hidden">
            {/* Render Chat History */}
            {chatHistory.map((chat, index) => (
              <div key={index}>
                {/* Prompt */}
                <div className="my-10 mx-0 flex items-center gap-5">
                <img src={user} alt="User" className="w-10 rounded-[50%]" />
                  <div>
                    <p className="text-lg font-[400] leading-[1.8]">{chat.prompt}</p>
                    <p className="text-xs text-gray-400">{chat.timestamp}</p>
                  </div>
                </div>
                {/* Response */}
                <div className="flex items-start gap-5 mb-10">
                  <img src={botlogo} alt="Bot" className="w-10 rounded-[50%]" />
                  {loading && index === chatHistory.length - 1 ? (
                    <div className="w-full flex flex-col gap-2">
                      {[...Array(3)].map((_, i) => (
                        <hr
                          key={i}
                          className="rounded-md border-none bg-gray-200 bg-gradient-to-r from-[#81cafe] via-[#ffffff] to-[#81cafe] p-4 animate-scroll-bg"
                        />
                      ))}
                    </div>
                  ) : (
                    <p
                      dangerouslySetInnerHTML={{ __html: chat.response }}
                      className="text-lg font-[400] leading-[1.8]"
                    ></p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Section */}
        <div className="absolute bottom-0 w-full max-w-[900px] px-5 mx-auto mt-5 pb-5">
          <div className="flex items-center justify-between gap-20 bg-gray-300 py-2 px-5 rounded-full">
            <input
              type="text"
              placeholder="Enter a prompt here..."
              style={{ color: 'black' }}
              className="flex-1 bg-transparent border-none outline-none p-2 text-lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="flex gap-4 items-center">
              <input
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                id="file-upload"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedFile(file);
                    console.log('Selected file:', file);
                  }
                }}
              />
              {/* <MdAddPhotoAlternate
                id="gallery"
                className="text-2xl cursor-pointer text-black"
                onClick={() => document.getElementById('file-upload').click()}
              /> */}
              <FaMicrophone
                className={`text-2xl cursor-pointer ${isListening ? "text-red-500" : "text-black"}`}
                onClick={handleVoiceInput}
              />
              {input && (
                <IoMdSend
                  onClick={handleSubmit}
                  className="text-2xl cursor-pointer text-black"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
