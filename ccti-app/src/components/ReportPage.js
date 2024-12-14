import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar"; 
import "./ReportPage.css"; 

function ReportPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

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
          <h2>Date: October 16, 2024</h2>
          <p>Prepared for: [Organization Name]</p>
          <p>Prepared by: CCTI via Security Team</p>

          <h3>1. Executive Summary</h3>
          <p>
            This report outlines a recently detected threat impacting critical
            systems in the network. Analysis was conducted using data from
            multiple threat intelligence (TI) platforms. One high-severity CVE
            is identified as actively being exploited, posing significant risks
            if not addressed.
          </p>

          <h3>2. Key Details</h3>
          <p>Threat Detected: Phishing Campaign with Credential Harvesting</p>
          <p>Date/Time Detected: October 15, 2024, 10:45 AM UTC</p>
          <p>Affected Systems: Email Gateway, User Workstations (Windows OS)</p>
          <p>
            Source of Threat: Malicious email attachments targeting employees.
          </p>

          <h3>3. CVE Mapping</h3>
          <p>
            <strong>CVE-2023-30799</strong>
          </p>
          <p>
            Description: Exploitation of a remote code execution vulnerability
            in Microsoft Outlook.
          </p>
          <p>Severity: Critical (CVSS Score: 9.8)</p>
          <p>
            TI Source Data: Exploit actively used in spear-phishing attacks.
          </p>

          <h4>Indicators of Compromise (IOCs)</h4>
          <p>
            Malicious domains:{" "}
            <a
              href="https://phishing-site.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              hxxps://phishing-site.com
            </a>
          </p>
          <p>IP Addresses: 192.168.1.55, 203.0.113.45</p>

          <h3>Actionable Insights</h3>
          <h4>Mitigation Steps:</h4>
          <ul>
            <li>
              Apply patch for CVE-2023-30799 to all Microsoft Outlook clients.
            </li>
            <li>
              Quarantine the compromised systems for forensic investigation.
            </li>
            <li>
              Update email filtering rules to block the identified malicious
              domains.
            </li>
          </ul>

          <h4>Next Steps:</h4>
          <ul>
            <li>
              Alert the Incident Response Team to further investigate lateral
              movement.
            </li>
            <li>Notify affected users and conduct a password reset.</li>
          </ul>
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

      {/* Popup */}
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
