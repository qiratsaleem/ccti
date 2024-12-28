import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chart, registerables } from "chart.js";
import Sidebar from "./Sidebar";
import Charts from "./Charts";
import "./Dashboard.css";

Chart.register(...registerables);

function Dashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [popupData, setPopupData] = useState(null);
  const [blockConfirmation, setBlockConfirmation] = useState(null);
  const [unblockConfirmation, setUnblockConfirmation] = useState(null);

  const blockButton = (logDetails) => {
    if (userRole === "admin") {
      // TODO: Implement blocking of users
      console.log("Blocking user:", logDetails);
      setBlockConfirmation(null); // Close confirmation after action
    }
  };

  const handleBlock = (logDetails) => {
    setBlockConfirmation(logDetails);
  };

  const handleUnblock = (logDetails) => {
    setUnblockConfirmation(logDetails);
  };

  const confirmUnblock = (logDetails) => {
    console.log("Unblocking:", logDetails);
    setUnblockConfirmation(null);
  };

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("role");
    console.log("Retrieved role:", roleFromStorage);
    setUserRole(roleFromStorage || "user");
  }, []);

  const showPopup = (logDetails) => {
    setPopupData(logDetails);
  };

  const closePopup = () => {
    setPopupData(null);
  };

  const adminChartsData = [
    {
      title: "IOC Severity Level",
      data: {
        labels: ["Critical", "High", "Medium", "Low"],
        datasets: [
          {
            label: "IOC Severity Level",
            data: [40, 88, 60, 73],
            backgroundColor: [
              "rgba(255, 92, 92, 0.8)",
              "rgba(255, 138, 51, 0.8)",
              "rgba(227, 225, 0, 0.8)",
              "rgba(212, 127, 255, 0.8)",
            ],
          },
        ],
      },
      type: "bar",
      size: "large-chart",
    },
    {
      title: "Logs per Day",
      data: {
        labels: ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Logs per Day",
            data: [10, 30, 80, 25, 10, 50, 70],
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.5)",
            tension: 0.5,
            fill: true,
          },
        ],
      },
      type: "line",
      size: "large-chart",
    },
    {
      title: "Log Analysis",
      data: {
        labels: ["Total Logs", "Reports Generated", "Blocked Logs"],
        datasets: [
          {
            label: "Log Analysis",
            data: [300, 200, 100],
            backgroundColor: [
              "rgba(0, 0, 255, 0.8)",
              "rgba(76, 175, 80, 0.8)",
              "rgba(255, 92, 92, 0.8)",
            ],
          },
        ],
      },
      type: "pie",
      size: "small-chart",
    },
    {
      title: "User Progress Analysis",
      data: {
        labels: ["User1", "User2", "User3", "User4"],
        datasets: [
          {
            label: "User Progress Analysis",
            data: [60, 95, 40, 34],
            backgroundColor: [
              "rgba(128, 0, 128, 0.8)",
              "rgba(0, 123, 255, 0.8)",
              "rgba(255, 165, 0, 0.8)",
              "rgba(76, 175, 80, 0.8)",
            ],
          },
        ],
      },
      type: "bar",
      size: "large-chart",
    },
  ];

  const userChartsData = [
    {
      title: "Logs per Day",
      data: {
        labels: ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Logs per Day",
            data: [5, 15, 20, 10, 5, 25, 30],
            borderColor: "#FFA500",
            backgroundColor: "rgba(255, 165, 0, 0.5)",
            tension: 0.5,
            fill: true,
          },
        ],
      },
      type: "line",
      size: "large-chart",
    },
    {
      title: "Blocked Logs",
      data: {
        labels: ["100", "200", "300", "400", "500", "600", "700", "800", "900", "1000"],
        datasets: [
          {
            label: "Blocked Logs",
            data: [1, 2, 3, 1, 2, 4, 2, 3, 4, 3],
            backgroundColor: "rgba(255, 92, 92, 0.8)",
          },
        ],
      },
      type: "bar",
      size: "large-chart",
    },
    {
      title: "Log Analysis",
      data: {
        labels: ["Resolved Logs", "Reports Generated", "Remaining Logs"],
        datasets: [
          {
            label: "Log Analysis",
            data: [200, 150, 100],
            backgroundColor: [
              "rgba(0, 0, 255, 0.8)",
              "rgba(76, 175, 80, 0.8)",
              "rgba(255, 92, 92, 0.8)",
            ],
          },
        ],
      },
      type: "pie",
      size: "small-chart",
    },
  ];

  const chartsData = userRole.toLowerCase() === "admin" ? adminChartsData : userChartsData;

  const stateCards = [
    { title: "Resolved Logs", value: "123" },
    { title: "Reports Generated", value: "789" },
    { title: "Remaining Logs", value: "456" },
  ];

  if (userRole.toLowerCase() === "admin") {
    stateCards.unshift({ title: "Total Users", value: "12" });
  }

  return (
    <div className="dashboard-container">
      <Sidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={() => {
          localStorage.clear();
          navigate("/login");
        }}
      />
      <header>
        <button onClick={() => setMenuOpen(true)} className="menu-button">
          ☰
        </button>
      </header>
      <div className="dashboard-content">
        <div className="stats-cards">
          {stateCards.map((card, index) => (
            <div key={index} className="stat-card">
              {card.title}
              <br />
              {card.value}
            </div>
          ))}
        </div>

        <Charts chartsData={chartsData} />

        <div className="log-entries">
          <div
            className="log-entry"
            onClick={() =>
              showPopup("2024-09-17 14:30:00Z | Privileged Access | User: admin")
            }
          >
            <span>2024-09-17 14:30:00Z | Privileged Access | User: admin</span>
            <div className="action-buttons">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/detail-display", {
                    state: { logId: "12345", details: "Investigation details for this log" },
                  });
                }}
                className="investigate-button"
              >
                Investigate
              </button>
            </div>
          </div>
          <div
            className="log-entry"
            onClick={() =>
              showPopup("2024-09-17 08:45:23Z | Login Attempt | User: jdoe | IP: 192.168.1.10 | Status: Failure")
            }
          >
            <span>2024-09-17 08:45:23Z | Login Attempt | User: jdoe | IP: 192.168.1.10 | Status: Failure</span>
            <div className="action-buttons">
              <button onClick={(e) => {
                e.stopPropagation();
                navigate("/report");
              }} className="report-button">
                Report
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleBlock("User: jdoe | IP: 192.168.1.10");
                }}
                className="block-button"
              >
                Block
              </button>
            </div>
          </div>
          <div
            className="log-entry"
            onClick={() =>
              showPopup("2024-09-18 10:00:00Z | Blocked IP | User: anonymous | IP: 203.0.113.5")
            }
          >
            <span>2024-09-18 10:00:00Z | Blocked IP | User: anonymous | IP: 203.0.113.5</span>
            <div className="action-buttons">
              <button onClick={(e) => {
                e.stopPropagation();
                navigate("/report");
              }} className="report-button">
                Report
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnblock("User: anonymous | IP: 203.0.113.5");
                }} 
                className="unblock-button"
              >
                Unblock
              </button>
            </div>
          </div>
        </div>
      </div>

      {popupData && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Log Details</h3>
            <p>{popupData}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      {blockConfirmation && (
        <div className="popup-overlay" onClick={() => setBlockConfirmation(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Block</h3>
            <p>Are you sure you want to block {blockConfirmation}?</p>
            <button onClick={() => blockButton(blockConfirmation)}>Yes</button>
            <button onClick={() => setBlockConfirmation(null)}>Cancel</button>
          </div>
        </div>
      )}

      {unblockConfirmation && (
        <div className="popup-overlay" onClick={() => setUnblockConfirmation(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Unblock</h3>
            <p>Are you sure you want to unblock {unblockConfirmation}?</p>
            <button onClick={() => confirmUnblock(unblockConfirmation)}>Yes</button>
            <button onClick={() => setUnblockConfirmation(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
