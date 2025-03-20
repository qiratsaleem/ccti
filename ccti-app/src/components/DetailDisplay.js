import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Add useParams
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Sidebar from "./Sidebar";
import { TailSpin } from "react-loader-spinner";
import "./DetailDisplay.css";

Chart.register(...registerables);

function DetailDisplay() {
  const navigate = useNavigate();
  const { logDetails: encodedLogDetails } = useParams(); // Extract encodedLogDetails from URL
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [loading, setLoading] = useState(false);
  const [logDetails, setLogDetails] = useState("");

  useEffect(() => {
    if (encodedLogDetails) {
      // Decode the log details from the URL
      const decodedLogDetails = decodeURIComponent(encodedLogDetails);
      console.log("Decoded logDetails in DetailDisplay.js:", decodedLogDetails); // Debugging line
      setLogDetails(decodedLogDetails);
    }
  }, [encodedLogDetails]); // Add encodedLogDetails as a dependency

  const handleReportButtonClick = async () => {
    try {
      setLoading(true);

      // Force logDetails to be a string
      const logDetailsString = typeof logDetails === 'string' 
        ? logDetails 
        : JSON.stringify(logDetails);

      console.log("logDetailsString:", logDetailsString); // Debugging line

      const userPrompt = `Generate a threat intelligence report for: ${logDetailsString}`;
      console.log("userPrompt:", userPrompt); // Debugging line

      const response = await fetch('http://127.0.0.1:8000/api/generate-report/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_prompt: userPrompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      navigate('/report', {
        state: {
          reportData: data.report_data,
          logDetails: logDetailsString,
        },
      });
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to generate report. Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformClick = (platform) => {
    const platformDetails = {
      "Virus Total": { threatType: "Malware", severity: "High", reputation: "Poor" },
      "Pulsedive": { threatType: "Phishing", severity: "Medium", reputation: "Moderate" },
      "AbuseIPDB": { threatType: "Ransomware", severity: "Critical", reputation: "Very Poor" },
      "Platform 6": { threatType: "DDoS", severity: "Low", reputation: "Good" },
    };
    setPopupData(platformDetails[platform]);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  const thresholdComparisonData = {
    labels: ["Virus Total", "Pulsedive", "AbuseIPDB", "Platform 6"],
    datasets: [
      {
        label: "Reputation Score",
        data: [30, 50, 70, 90],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="details-page-container">
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="details-page">
        <div className="header-container">
          <div className="back-arrow" onClick={() => navigate(-1)}>
            &#8592;
          </div>
          <h1 className="output-heading">Threat Intelligence Output</h1>
          <button onClick={() => setMenuOpen(!menuOpen)} className="menu-button">
            ☰
          </button>
        </div>

        {logDetails && (
          <div className="log-details-display">
            <p><strong>Log Details:</strong> {logDetails}</p>
          </div>
        )}

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
            <button className="generate-report-btn" onClick={handleReportButtonClick}>
              Generate Report
            </button>
          </div>

          <div className="TIplatforms">
            <h3>TI PLATFORMS</h3>
            <div className="platform-status">
              <h4>Reputable:</h4>
              <ul>
                <li className="platform-item">Platform 2</li>
                <li className="platform-item">Platform 5</li>
                <li className="platform-item">Platform 7</li>
                <li className="platform-item">Platform 8</li>
              </ul>
              <h4>Non-Reputable:</h4>
              <ul>
                <li className="platform-item" onClick={() => handlePlatformClick("Virus Total")}>
                  Virus Total
                </li>
                <li className="platform-item" onClick={() => handlePlatformClick("Pulsedive")}>
                  Pulsedive
                </li>
                <li className="platform-item" onClick={() => handlePlatformClick("AbuseIPDB")}>
                  AbuseIPDB
                </li>
                <li className="platform-item" onClick={() => handlePlatformClick("Platform 6")}>
                  Platform 6
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="threshold-comparison">
          <h3>Reputation Score Comparison</h3>
          <Bar data={thresholdComparisonData} options={{ responsive: true }} />
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <TailSpin color="#3498db" height={50} width={50} />
          <p>Generating report, please wait...</p>
        </div>
      )}

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