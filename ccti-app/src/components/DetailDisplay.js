import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Sidebar from "./Sidebar";
import "./DetailDisplay.css";

Chart.register(...registerables);

function DetailDisplay() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
 
  const role = localStorage.getItem("role") || "user";  

  const thresholdComparisonData = {
    labels: ["Threshold 1", "Threshold 2", "Threshold 3", "Threshold 4"],
    datasets: [
      {
        label: "Value",
        data: [30, 45, 60, 80],
        backgroundColor: [
          "rgba(128, 0, 128, 0.8)",
          "rgba(0, 123, 255, 0.8)",
          "rgba(255, 165, 0, 0.8)",
          "rgba(76, 175, 80, 0.8)",
        ],
        hoverBackgroundColor: [
          "rgba(90, 0, 90, 1)",
          "rgba(0, 86, 179, 1)",
          "rgba(204, 132, 0, 1)",
          "rgba(56, 124, 59, 1)",
        ],
        barPercentage: 0.4,
        borderRadius: 5,
      },
    ],
  };

  
  const handleBackClick = () => {
    if (role === "admin") {
      navigate("/dashboard"); 
    } else {
      navigate("/dashboard"); 
    }
  };

  const handleReportNavigation = () => {
    navigate("/report", { state: { from: "detail-display" } });
  };

  const handlePlatformClick = (platform) => {
    const platformDetails = {
      "Virus Total": {
        threatType: "Malware",
        severity: "High",
        reputation: "Poor",
      },
      "Platform 2": {
        threatType: "Phishing",
        severity: "Medium",
        reputation: "Moderate",
      },
      "Platform 5": {
        threatType: "Ransomware",
        severity: "Critical",
        reputation: "Very Poor",
      },
      "Platform 7": {
        threatType: "DDoS",
        severity: "Low",
        reputation: "Good",
      },
    };
    setPopupData(platformDetails[platform]);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  return (
    <div className="details-page-container">
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="details-page">
        <div className="header-container">
          <div className="back-arrow" onClick={handleBackClick}>
            &#8592;
          </div>
          <h1 className="output-heading">Threat Intelligence Output</h1>
          <button onClick={() => setMenuOpen(!menuOpen)} className="menu-button">
            ☰
          </button>
        </div>

        <div className="main-content">
          <div className="predicted-outcome">
            <h2>Predicted Outcome</h2>
            <p>
              Highlight key features that influenced the decision (e.g., IP
              Reputation Score, Log Severity)
            </p>
            <ul>
              <li>IP Reputation</li>
              <li>Threat Type</li>
              <li>Severity</li>
            </ul>
            <p>
              The system has analyzed data from multiple platforms, providing a
              unified reputation score to indicate the overall security posture.
            </p>
         
            <button className="generate-report-btn" onClick={handleReportNavigation}>
              Generate Report
            </button>
          </div>

          <div className="ti-platforms">
            <h3>TI PLATFORMS</h3>
            <div className="platform-status">
              <h4>Responded:</h4>
              <ul>
                <li
                  className="platform-item"
                  onClick={() => handlePlatformClick("Virus Total")}
                >
                  Virus Total
                </li>
                <li
                  className="platform-item"
                  onClick={() => handlePlatformClick("Platform 2")}
                >
                  Platform 2
                </li>
                <li
                  className="platform-item"
                  onClick={() => handlePlatformClick("Platform 5")}
                >
                  Platform 5
                </li>
                <li
                  className="platform-item"
                  onClick={() => handlePlatformClick("Platform 7")}
                >
                  Platform 7
                </li>
              </ul>
              <h4>Not Responded:</h4>
              <ul>
                <li className="platform-item">Platform 3</li>
                <li className="platform-item">Platform 4</li>
                <li className="platform-item">Platform 6</li>
                <li className="platform-item">Platform 8</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="threshold-comparison">
          <h3>Threshold Comparison</h3>
          <Bar data={thresholdComparisonData} options={{ responsive: true }} />
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Platform Details</h3>
            <p>
              <strong>Threat Type:</strong> {popupData.threatType}
            </p>
            <p>
              <strong>Severity:</strong> {popupData.severity}
            </p>
            <p>
              <strong>Reputation:</strong> {popupData.reputation}
            </p>
            <button className="close-popup" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailDisplay;
