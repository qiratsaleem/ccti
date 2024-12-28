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
      "Pulsedive": {
        threatType: "Phishing",
        severity: "Medium",
        reputation: "Moderate",
      },
      "AbuseIPDB": {
        threatType: "Ransomware",
        severity: "Critical",
        reputation: "Very Poor",
      },
      "Platform 6": {
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
          <div className="optimal-output">
            <h2 className="optimal-output-heading">Optimal Output</h2>
            <h4 className="ml-analysis-heading">ML Analysis Results</h4>

            <div className="ml-response-list">
              <div className="response-item">
                <span className="label">IP Reputation Score</span>
                <span className="value">0</span>
              </div>
              <div className="response-item">
                <span className="label">Threat Classification</span>
                <span className="value">Unrated</span>
              </div>
              <div className="response-item">
                <span className="label">Risk Level</span>
                <span className="value">Low</span>
              </div>
            </div>

            <p className="ml-analysis-description">
              Based on machine learning analysis, this IP address has been evaluated for potential security risks.
            </p>
            <button className="generate-report-btn" onClick={handleReportNavigation}>
              Generate Report
            </button>
          </div>

          <div className="TIplatforms">
            <h3>TI PLATFORMS</h3>
            <div className="platform-status">
            <h4>reputable:</h4>
              <ul>
                <li className="platform-item">Platform 2</li>
                <li className="platform-item">Platform 5</li>
                <li className="platform-item">Platform 7</li>
                <li className="platform-item">Platform 8</li>
              </ul>
              <h4>non-reputable:</h4>
              <ul>
                <li
                  className="platform-item"
                  onClick={() => handlePlatformClick("Virus Total")}
                >
                  Virus Total
                </li>
                <li
                  className="platform-item"
                  onClick={() => handlePlatformClick("Pulsedive")}
                >
                  Pulsedive
                </li>
                <li
                  className="platform-item"
                  onClick={() => handlePlatformClick("AbuseIPDB")}
                >
                  AbuseIPDB
                </li>
                <li
                  className="platform-item"
                  onClick={() => handlePlatformClick("Platform 6")}
                >
                  Platform 6
                </li>
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
