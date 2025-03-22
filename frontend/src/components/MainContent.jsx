import React, { useState, useEffect } from "react";
import './MainContent.css';
import { fetchFAQs, sendQuery } from "./api";
import { FaUserCircle, FaMicrophone } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import botlogo from "../assets/logo.png";

const MainContent = () => {
  const [input, setInput] = useState('');
  const [recentPrompt, setRecentPrompt] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

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
      setResultData(result); // Keep this for loading state consistency
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

  return (
    <div className="main flex-1 min-h-screen pb-[15vh] relative">
      <div className="flex items-center justify-between text-xl p-5 text-slate-700">
        <p>Neural Search</p>
        <FaUserCircle />
      </div>

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

            <div className="h-[200px] p-4  rounded-lg relative cursor-pointer hover:bg-white-800" style={{ backgroundColor: 'rgba(37, 100, 235, 0.43)' }}>
                 <p className=" font-medium text-lg" style={{ color: "black" } }>
                     How does E-invoicing work in IDMS?
                 </p>
 
               </div>

               <div className="h-[200px] p-4 bg-blue-300 rounded-lg relative cursor-pointer hover:bg-gray-100  > "style={{ backgroundColor: 'rgba(37, 100, 235, 0.43)' }}>
                 <p className=" font-medium text-lg" style={{ color: "black" }}>
                   What are the different types of GST in IDMS?
                 </p>
 
               </div>

               <div className="h-[200px] p-4 bg-blue-300 rounded-lg relative cursor-pointer hover:bg-gray-300"style={{ backgroundColor: 'rgba(37, 100, 235, 0.43)' }}>
                 <p className=" font-medium text-lg " style={{ color: "black" }}>
                   How does IDMS automate GST payments"?
                 </p>
 
               </div>

               <div className="h-[200px] p-4 bg-blue-300 rounded-lg relative cursor-pointer hover:bg-gray-300"style={{ backgroundColor: 'rgba(37, 100, 235, 0.43)' }}>
                 <p className="font-medium text-lg" style={{ color: "black" }}>
                   Can IDMS generate GST returns automatically?
                 </p>

                 </div>

              </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="h-[200px] p-4 rounded-lg cursor-pointer"
                  style={{ backgroundColor: 'rgba(37, 100, 235, 0.13)' }}
                  onClick={() => {
                    setInput(faq.question);
                    handleSubmit();
                  }}
                >
                  <p className="font-medium text-lg text-white">{faq.question}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-0 px-[5%] max-h-[70vh] overflow-y-scroll scrollbar-hidden">
            {/* Render Chat History */}
            {chatHistory.map((chat, index) => (
              <div key={index}>
                {/* Prompt */}
                <div className="my-10 mx-0 flex items-center gap-5">
                  <FaUserCircle className="text-3xl" />
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
              className="flex-1 bg-transparent border-none outline-none p-2 text-lg "
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress} // Add this to handle Enter key
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
              <MdAddPhotoAlternate
                id="gallery"
                className="text-2xl cursor-pointer text-black"
                onClick={() => document.getElementById('file-upload').click()}
              />
              <FaMicrophone className="text-2xl cursor-pointer text-black" />
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
