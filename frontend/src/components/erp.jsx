import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/logo.png"

const API_URL = "http://localhost:3001";

export default function ModuleChecker() {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [data, setData] = useState({ master_data: [], transactions: [] });
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/erp/list_modules`).then((res) => setModules(res.data.available_modules));
  }, []);

  const fetchData = () => {
    if (!selectedModule) return;
    axios
      .get(`${API_URL}/erp/check_module/${selectedModule}`)
      .then((res) => setData(res.data))
      .catch(() => setData({ master_data: [], transactions: [] }));
  };

  return (
    <div className="p-4">
      {/* Header with Logo and Title */}
      <div className="flex items-center gap-4 mb-4">
        <img src={logo} alt="Company Logo" className="h-12 w-12" />
        <h2 className="text-2xl font-bold">ERP Data Viewer</h2>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex gap-4 mb-4">
          <select 
            className="border p-2 rounded" 
            value={selectedModule} 
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            <option value="">Select a Module</option>
            {modules.map((mod) => (
              <option key={mod} value={mod}>{mod}</option>
            ))}
          </select>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded" 
            onClick={fetchData}
          >
            Fetch Data
          </button>
        </div>

        <input
          type="text"
          placeholder="Search data..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        
        {/* Render Master Data */}
        <h3 className="text-lg font-semibold">Master Data</h3>
        {data.master_data.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(data.master_data[0]).map((key) => (
                  <th key={key} className="border border-gray-300 p-2">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.master_data
                .filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))
                .map((item, index) => (
                  <tr key={index} className="border border-gray-300">
                    {Object.values(item).map((val, i) => (
                      <td key={i} className="border border-gray-300 p-2">{val}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        ) : <p>Select a Module to view</p>}

        {/* Render Transactions */}
        <h3 className="text-lg font-semibold">Transactions</h3>
        {data.transactions.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(data.transactions[0]).map((key) => (
                  <th key={key} className="border border-gray-300 p-2">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.transactions
                .filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))
                .map((item, index) => (
                  <tr key={index} className="border border-gray-300">
                    {Object.values(item).map((val, i) => (
                      <td key={i} className="border border-gray-300 p-2">{val}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        ) : <p>Select a Module to view</p>}
      </div>
    </div>
  );
}