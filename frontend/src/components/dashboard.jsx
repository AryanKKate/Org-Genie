import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [groupedFAQs, setGroupedFAQs] = useState([]);
  const [expandedFaqs, setExpandedFaqs] = useState({});

  useEffect(() => {
    fetch("http://localhost:3001/dash")
      .then((res) => res.json())
      .then((data) => setGroupedFAQs(data))
      .catch((err) => console.error("Error fetching FAQs:", err));
  }, []);

  const toggleFaq = (key) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-5 bg-blue-600" >
      <h1 className="text-3xl font-bold mb-8 text-center">
        Frequently Hit FAQs Dashboard
      </h1>
      {groupedFAQs.length === 0 ? (
        <p className="text-center">No FAQ data available.</p>
      ) : (
        groupedFAQs.map((group) => (
          <div key={group._id} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b border-white pb-2">
              {group._id}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {group.faqs.map((faq, index) => {
                const key = `${group._id}-${index}`;
                return (
                  <li
                    key={key}
                    className="bg-white text-black p-4 rounded shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => toggleFaq(key)}
                  >
                    <p className="font-bold text-lg">{faq.question}</p>
                    <p className="text-sm text-gray-600">Hits: {faq.hit}</p>
                    {expandedFaqs[key] && (
                      <p className="text-sm mt-2">{faq.answer}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
