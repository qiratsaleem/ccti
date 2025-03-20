import React, { useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./ReportPage.css";

function ReportPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the report data and log details
  const { reportData, logDetails } = location.state || {};
  console.log(reportData)
  const handleSendClick = () => {
    alert(`Report sent to ${email}`);
    setShowPopup(false);
    setEmail("");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleBackClick = () => {
    if (location.state?.from === "detail-display") {
      navigate("/detail-display");
    } else {
      navigate("/dashboard", { state: { from: "report-page" } });
    }
  };
//   // Debugging logs
//   useEffect(() => {
//     console.log("Raw Report Data:", reportData);
//     if (reportData?.report_data) {
//       console.log("Structured Report Data:", reportData.report_data);
//     }
//   }, [reportData]);

//   const parseReportContent = (data) => {
//     if (!data?.report_data) {
//       console.error("Invalid report data structure");
//       return {
//         executiveSummary: "Report generation failed. Please try again.",
//         keyDetails: "Check console for details.",
//         cveMapping: "No CVE data available.",
//         actionableInsights: "Contact support if the issue persists.",
//       };
//     }

//     // Directly use the structured data
//     return {
//       executiveSummary: data.report_data.executiveSummary || "No executive summary available.",
//       keyDetails: data.report_data.keyDetails || "No key details available.",
//       cveMapping: data.report_data.cveMapping || "No CVE mapping available.",
//       actionableInsights: data.report_data.actionableInsights || "No insights available.",
//     };
//   };

//   const { executiveSummary, keyDetails, cveMapping, actionableInsights } = parseReportContent(reportData || {});

  return (
    <div className="report-page">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <button className="back-button" onClick={handleBackClick}>
        ←
      </button>
      <button className="hamburger-button" onClick={toggleSidebar}>
        &#9776;
      </button>

      <div className={`report-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <h1 className="report-heading">Report</h1>
        <div className="report-details">
          <h2>Date: {new Date().toLocaleDateString()}</h2>
          <p>Prepared for: [Organization Name]</p>
          <p>Prepared by: CCTI via Security Team</p>
          <p>Log Details: {logDetails}</p>
        </div>

        <div className="report-sections">
          <section>
            <h2>Executive Summary</h2>
            {<p>{reportData.executiveSummary}</p>}
          </section>

          <section>
            <h2>Key Details</h2>
            {<p>{reportData.keyDetails}</p> }
          </section>

          <section>
            <h2>CVE Mapping</h2>
            {<p>{reportData.cveMapping}</p> }
          </section>

          <section>
            <h2>Actionable Insights</h2>
            {<p>{reportData.actionableInsights}</p>}
          </section>
        </div>

        <div className="button-group">
          <button>Edit</button>
          <button>Print</button>
          <button>Save</button>
          <button>Download</button>
          <button onClick={() => setShowPopup(true)}>Share</button>
          <button>Block IP</button>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Enter Email</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
            <button onClick={handleSendClick}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPage;