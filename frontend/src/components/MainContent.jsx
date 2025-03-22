import React, { useContext, useState, useEffect } from "react"
import './MainContent.css'
import { fetchFAQs, sendQuery } from './api'

import {
  FaUserCircle,
  FaMicrophone,
} from "react-icons/fa"
import { FaMessage } from "react-icons/fa6"
import { MdAddPhotoAlternate } from "react-icons/md"
import { IoMdSend } from "react-icons/io"
import { Context } from "../context/Context"
import geminiLogo from "../assets/modiji.png"

const MainContent = () => {
  const {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    prevPrompt,
    setPrevPrompt,
    showResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    onSent,
  } = useContext(Context);

  const [faqs, setFaqs] = useState([]);

  // Fetch FAQs on component mount
  useEffect(() => {
    const loadFAQs = async () => {
      const data = await fetchFAQs();
      setFaqs(data);
    };
    loadFAQs();
  }, []);

  // Handle query submission
  const handleSubmit = async () => {
    if (!input) return;
    setLoading(true);
    setRecentPrompt(input);
    try {
      const response = await sendQuery(input);
      setResultData(response.response);
    } catch (error) {
      console.error("Error handling query:", error);
      setResultData("Failed to get a response.");
    }
    setLoading(false);
    setInput('');
  };

  return (
    <div className="main flex-1 min-h-screen pb-[15vh] relative">
      <div className="flex items-center justify-between text-xl p-5 text-slate-700">
        <p>Neural Search</p>
        <FaUserCircle />
      </div>

      <div className="max-w-[900px] mx-auto">
        {!showResult ? (
          <>
            <div className="my-12 text-[56px] text-slate-500 font-semibold p-5">
              <p className="text-slate-400">How may I assist you?</p>
            </div>

            <div className="my-1 text-[20px] text-slate-500 font-semibold px-7">
              <p>Most Frequently Asked Questions</p>
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
                  <p className="font-medium text-lg" style={{ color: "white" }}>
                    {faq.question}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-0 px-[5%] max-h-[70vh] overflow-y-scroll scrollbar-hidden">
            <div className="my-10 mx-0 flex items-center gap-5">
              <FaUserCircle className="text-3xl" />
              <p className="text-lg font-[400] leading-[1.8]">{recentPrompt}</p>
            </div>

            <div className="flex items-start gap-5">
              <img src={geminiLogo} alt="Gemini" className="w-10 rounded-[50%]" />
              {loading ? (
                <div className="w-full flex flex-col gap-2">
                  {[...Array(3)].map((_, i) => (
                    <hr key={i} className="rounded-md border-none bg-gray-200 bg-gradient-to-r from-[#81cafe] via-[#ffffff] to-[#81cafe] p-4 animate-scroll-bg" />
                  ))}
                </div>
              ) : (
                <p
                  dangerouslySetInnerHTML={{ __html: resultData }}
                  className="text-lg font-[400] leading-[1.8]"
                ></p>
              )}
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="absolute bottom-0 w-full max-w-[900px] px-5 mx-auto mt-5">
          <div className="flex items-center justify-between gap-20 bg-gray-200 py-2 px-5 rounded-full">
            <input
              type="text"
              placeholder="Enter a prompt here..."
              className="flex-1 bg-transparent border-none outline-none p-2 text-lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex gap-4 items-center">
              <MdAddPhotoAlternate className="text-2xl cursor-pointer" />
              <FaMicrophone className="text-2xl cursor-pointer" />
              {input && (
                <IoMdSend
                  onClick={handleSubmit}
                  className="text-2xl cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainContent;
