import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./ReportPage.css";
import { jsPDF } from "jspdf";

function ReportPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [setSendStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the report data and log details
  const { reportData, logDetails } = location.state || {};

  const handleSendClick = async () => {
    if (!email) {
      alert("Please enter a valid email address");
      return;
    }

    setIsSending(true);
    setSendStatus(null);

    try {
      const response = await fetch("http://localhost:8000/api/send-report/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          reportData: reportData
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`Report successfully sent to ${email}`);
      } else {
        alert(`Failed to send report: ${result.error}`);
      }
    } catch (error) {
      alert(`Error sending report: ${error.toString()}`);
    } finally {
      setIsSending(false);
      setShowPopup(false);
      setEmail("");
    }
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

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Threat Intelligence Report", 105, 20, { align: 'center' });
    
    // Add metadata
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text("Prepared for: [Organization Name]", 14, 38);
    doc.text("Prepared by: CCTI via Security Team", 14, 46);
    doc.text(`Log Details: ${logDetails || "N/A"}`, 14, 54);
    
    let yPosition = 70;
    
    // Add Executive Summary section
    doc.setFontSize(16);
    doc.text("Executive Summary", 14, yPosition);
    doc.setFontSize(12);
    const execSummaryLines = doc.splitTextToSize(reportData?.executiveSummary || "No executive summary available.", 180);
    doc.text(execSummaryLines, 14, yPosition + 10);
    yPosition += 10 + (execSummaryLines.length * 7);
    
    // Add Key Details section
    doc.setFontSize(16);
    doc.text("Key Details", 14, yPosition + 10);
    doc.setFontSize(12);
    const keyDetailsLines = doc.splitTextToSize(reportData?.keyDetails || "No key details available.", 180);
    doc.text(keyDetailsLines, 14, yPosition + 20);
    yPosition += 20 + (keyDetailsLines.length * 7);
    
    // Add CVE Mapping section
    doc.setFontSize(16);
    doc.text("CVE Mapping", 14, yPosition + 10);
    doc.setFontSize(12);
    const cveMappingLines = doc.splitTextToSize(reportData?.cveMapping || "No CVE mapping available.", 180);
    doc.text(cveMappingLines, 14, yPosition + 20);
    yPosition += 20 + (cveMappingLines.length * 7);
    
    // Add Actionable Insights section
    doc.setFontSize(16);
    doc.text("Actionable Insights", 14, yPosition + 10);
    doc.setFontSize(12);
    const insightsLines = doc.splitTextToSize(reportData?.actionableInsights || "No insights available.", 180);
    doc.text(insightsLines, 14, yPosition + 20);
    
    // Save the PDF
    doc.save("Threat_Intelligence_Report.pdf");
  };

  const handlePrint = () => {
    // Create a print-friendly version of the report
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Threat Intelligence Report</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1 { color: #333; text-align: center; }
          h2 { color: #444; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .report-meta { margin-bottom: 30px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
            @page { size: auto; margin: 10mm; }
          }
        </style>
      </head>
      <body>
        <h1>Threat Intelligence Report</h1>
        
        <div class="report-meta">
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Prepared for:</strong> [Organization Name]</p>
          <p><strong>Prepared by:</strong> CCTI via Security Team</p>
          <p><strong>Log Details:</strong> ${logDetails || "N/A"}</p>
        </div>
        
        <h2>Executive Summary</h2>
        <p>${reportData?.executiveSummary || "No executive summary available."}</p>
        
        <h2>Key Details</h2>
        <p>${reportData?.keyDetails || "No key details available."}</p>
        
        <h2>CVE Mapping</h2>
        <p>${reportData?.cveMapping || "No CVE mapping available."}</p>
        
        <h2>Actionable Insights</h2>
        <p>${reportData?.actionableInsights || "No insights available."}</p>
        
        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <p>This document was generated by CCTI Security Team</p>
        </div>
      </body>
      </html>
    `;

    // Open print window
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load before printing
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 300);
    };
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
          <h2>Date: {new Date().toLocaleDateString()}</h2>
          <p>Prepared for: [Organization Name]</p>
          <p>Prepared by: CCTI via Security Team</p>
          <p>Log Details: {logDetails}</p>
        </div>

        <div className="report-sections">
          <section>
            <h2>Executive Summary</h2>
            <p>{reportData?.executiveSummary || "No executive summary available."}</p>
          </section>

          <section>
            <h2>Key Details</h2>
            <p>{reportData?.keyDetails || "No key details available."}</p>
          </section>

          <section>
            <h2>CVE Mapping</h2>
            <p>{reportData?.cveMapping || "No CVE mapping available."}</p>
          </section>

          <section>
            <h2>Actionable Insights</h2>
            <p>{reportData?.actionableInsights || "No insights available."}</p>
          </section>
        </div>

        <div className="button-group">
          <button>Edit</button>
          <button onClick={handlePrint}>Print</button>
          <button>Save</button>
          <button onClick={downloadPDF}>Download</button>
          <button onClick={() => setShowPopup(true)} disabled={isSending}>
            {isSending ? "Sending..." : "Share"}
          </button>
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
              placeholder="Enter recipient email"
              disabled={isSending}
            />
            <div className="popup-buttons">
              <button onClick={handleSendClick} disabled={isSending}>
                {isSending ? "Sending..." : "Send"}
              </button>
              <button onClick={() => setShowPopup(false)} disabled={isSending}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPage;