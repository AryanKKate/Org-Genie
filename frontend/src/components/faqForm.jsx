import { useState } from "react";
import axios from "axios";
import { IoMdSend } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";

const FaqForm = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async () => {
    if (!question || !answer) {
      alert("Both question and answer are required!");
      return;
    }

    let data = { question, answer };
    try {
      const res = await axios.post("http://localhost:3001/add-faq", data);
      alert("FAQ Added Successfully");
      setQuestion("");
      setAnswer("");
      setJsonInput("");
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Server error"));
    }
  };

  return (
    <div className="main flex-1 min-h-screen pb-[15vh] relative">
      <div className="flex items-center justify-between text-xl p-5 text-slate-700">
        <p>Add New FAQ</p>
      </div>

      <div className="max-w-[900px] mx-auto">
        <div className="my-12 text-[40px] text-slate-500 font-semibold p-5">
          <p className="text-slate-400">Enter a Question and Answer</p>
        </div>

        {/* Input Section */}
        <div className="absolute bottom-0 w-full max-w-[900px] px-5 mx-auto mt-5 pb-5">
          <div className="flex flex-col bg-gray-300 py-4 px-5 rounded-2xl shadow-md">
            <input
              type="text"
              placeholder="Enter your question..."
              className="w-full bg-transparent border-none outline-none p-2 text-lg text-black"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <hr className="border-gray-400 my-2" />
            <input
              type="text"
              placeholder="Enter the answer..."
              className="w-full bg-transparent border-none outline-none p-2 text-lg text-black"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <hr className="border-gray-400 my-2" />
            <textarea
              placeholder="Or enter JSON input..."
              className="w-full bg-transparent border-none outline-none p-2 text-lg text-black resize-none"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-4 items-center">
                <input
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  id="file-upload"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedFile(file);
                      console.log("Selected file:", file);
                    }
                  }}
                />
                <MdAddPhotoAlternate
                  className="text-2xl cursor-pointer text-black"
                  onClick={() => document.getElementById("file-upload").click()}
                />
                <FaMicrophone
                  className={`text-2xl cursor-pointer ${isListening ? "text-red-500" : "text-black"}`}
                  onClick={() => setIsListening(!isListening)}
                />
              </div>
              {question && answer && (
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

export default FaqForm;
