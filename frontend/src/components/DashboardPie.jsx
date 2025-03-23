import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPieChart = () => {
  const [groupedFAQs, setGroupedFAQs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/dash")
      .then((res) => res.json())
      .then((data) => setGroupedFAQs(data))
      .catch((err) => console.error("Error fetching FAQs:", err));
  }, []);

  // Prepare labels (categories) and compute total hit count per category
  const labels = groupedFAQs.map((group) => group._id);
  const dataValues = groupedFAQs.map((group) =>
    group.faqs.reduce((sum, faq) => sum + (faq.hit || 0), 0)
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Total Hits",
        data: dataValues,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#F7464A",
          "#46BFBD",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#F7464A",
          "#46BFBD",
        ],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="p-5 bg-white shadow-md rounded" style={{ width: '250px', height: '250px' }}>
      <h2 className="text-xl font-bold mb-4">Hits by Category</h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default DashboardPieChart;
