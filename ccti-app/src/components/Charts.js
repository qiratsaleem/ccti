// Charts.js
import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";

const Charts = ({ chartsData, chartOptions }) => {
  return (
    <div className="chart-container">
      {chartsData.map((chart, index) => (
        <div className={`chart ${chart.size}`} key={index}>
          <h2>{chart.title}</h2>
          {chart.type === "bar" && <Bar data={chart.data} options={chartOptions} />}
          {chart.type === "line" && <Line data={chart.data} options={chartOptions} />}
          {chart.type === "pie" && <Pie data={chart.data} options={chartOptions} />}
        </div>
      ))}
    </div>
  );
};

export default Charts;
