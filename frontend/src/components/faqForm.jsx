import { useState } from "react";
import axios from "axios";
import { IoMdSend } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";

const FaqForm = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [faqs, setFaqs] = useState([]); // Store multiple FAQs
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle manual FAQ submission
  const handleSubmitSingle = async () => {
    if (!question || !answer) {
      alert("Both question and answer are required!");
      return;
    }

    let data = { question, answer };
    try {
      await axios.post("http://localhost:3001/add-faq", data);
      alert("FAQ Added Successfully");
      setQuestion("");
      setAnswer("");
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Server error"));
    }
  };

  // Handle bulk FAQ submission
  const handleSubmitBulk = async () => {
    if (faqs.length === 0) {
      alert("No FAQs to submit!");
      return;
    }

    try {
      await axios.post("http://localhost:3001/add-faq-bulk", { faqs });
      alert("FAQs Added Successfully");
      setFaqs([]);
      setSelectedFile(null);
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Server error"));
    }
  };

  // Handle JSON file upload for multiple questions and answers
  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          if (Array.isArray(jsonData) && jsonData.every(faq => faq.question && faq.answer)) {
            setFaqs(jsonData); // Store multiple FAQs
          } else {
            alert("Invalid JSON format! Ensure it contains an array of { question, answer } objects.");
          }
        } catch (error) {
          alert("Error parsing JSON file!");
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <div className="main flex-1 min-h-screen pb-[15vh] relative">
      <div className="flex items-center justify-between text-xl p-5 text-slate-700">
        <p>Add New FAQs (Manual & Bulk Upload Supported)</p>
      </div>

      <div className="max-w-[900px] mx-auto">
        <div className="my-12 text-[40px] text-slate-500 font-semibold p-5">
          <p className="text-slate-400">Enter a Question & Answer or Upload a JSON File</p>
        </div>

        {/* Manual Input Section */}
        <div className="mb-8 bg-gray-300 py-4 px-5 rounded-2xl shadow-md">
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

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-4 items-center">
              {/* Image Upload */}
              <input
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                id="file-upload"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <MdAddPhotoAlternate
                className="text-2xl cursor-pointer text-black"
                onClick={() => document.getElementById("file-upload").click()}
              />

              {/* Microphone (Placeholder for future implementation) */}
              <FaMicrophone
                className={`text-2xl cursor-pointer ${isListening ? "text-red-500" : "text-black"}`}
                onClick={() => setIsListening(!isListening)}
              />
            </div>

            {/* Submit Single FAQ */}
            {question && answer && (
              <IoMdSend
                onClick={handleSubmitSingle}
                className="text-2xl cursor-pointer text-black"
              />
            )}
          </div>
        </div>

        {/* JSON Upload Section */}
        <div className="bg-gray-300 py-4 px-5 rounded-2xl shadow-md">
          <input
            type="file"
            accept=".json"
            style={{ display: "none" }}
            id="json-upload"
            onChange={handleJsonUpload}
          />
          <div className="flex gap-4 items-center">
            <FaFileUpload
              className="text-2xl cursor-pointer text-black"
              onClick={() => document.getElementById("json-upload").click()}
            />
            <p>{selectedFile ? selectedFile.name : "Upload JSON file"}</p>
          </div>

          {/* Display Uploaded FAQs */}
          {faqs.length > 0 && (
            <div className="mt-4 p-3 bg-white rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Uploaded FAQs:</h3>
              <ul className="max-h-[200px] overflow-y-auto">
                {faqs.map((faq, index) => (
                  <li key={index} className="text-black border-b py-2">
                    <strong>Q:</strong> {faq.question} <br />
                    <strong>A:</strong> {faq.answer}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Button */}
          {faqs.length > 0 && (
            <button
              onClick={handleSubmitBulk}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              Upload FAQs
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqForm;
