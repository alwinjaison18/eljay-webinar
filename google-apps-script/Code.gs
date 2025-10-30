/**
 * Google Apps Script for Eljay Medical Staffing Webinar Registration
 * This script receives POST requests from the React app and stores data in Google Sheets
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Create a new Google Sheet:
 *    - Go to https://sheets.google.com
 *    - Create a new spreadsheet
 *    - Name it "Eljay Webinar Registrations"
 *    - Copy the Sheet ID from the URL (the long string between /d/ and /edit)
 *
 * 2. Set up the Apps Script:
 *    - In your Google Sheet, click Extensions → Apps Script
 *    - Delete any existing code
 *    - Paste this entire script
 *    - Replace 'YOUR_SHEET_ID_HERE' below with your actual Sheet ID
 *
 * 3. Deploy as Web App:
 *    - Click the "Deploy" button (top right) → "New deployment"
 *    - Click the gear icon next to "Select type" → Choose "Web app"
 *    - Fill in the details:
 *      - Description: "Webinar Registration API"
 *      - Execute as: "Me"
 *      - Who has access: "Anyone"
 *    - Click "Deploy"
 *    - Copy the Web App URL
 *    - Authorize the app if prompted
 *
 * 4. Add the URL to your React app:
 *    - Copy the Web App URL
 *    - In your React project, create a .env file
 *    - Add: VITE_GOOGLE_SCRIPT_URL=your_web_app_url_here
 *
 * 5. Sheet Structure:
 *    The script will automatically create headers in the first row:
 *    Timestamp | Full Name | Email | Phone | Qualification | Webinar Date
 */

// Replace this with your actual Google Sheet ID
const SHEET_ID = "YOUR_SHEET_ID_HERE";
const SHEET_NAME = "Registrations"; // You can change this to your sheet tab name

/**
 * Handles POST requests from the React app
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Get the active spreadsheet and sheet
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Add headers with payment status columns
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Email",
        "Phone",
        "Qualification/Experience",
        "Webinar Date",
        "Payment Status",
        "Payment ID",
        "Amount",
        "Failure Reason",
      ]);

      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4285f4");
      headerRange.setFontColor("#ffffff");
    }

    // Prepare row data with payment status
    const rowData = [
      new Date(data.timestamp),
      data.fullName,
      data.email,
      data.phone,
      data.qualification,
      data.webinarDate,
      data.paymentStatus || "PENDING",
      data.paymentId || "N/A",
      data.amount || "₹999",
      data.failureReason || "",
    ];

    // Append the data to the sheet
    sheet.appendRow(rowData);

    // Color code the payment status cell
    const lastRow = sheet.getLastRow();
    const statusCell = sheet.getRange(lastRow, 7); // Column G (Payment Status)

    if (data.paymentStatus === "SUCCESS") {
      statusCell.setBackground("#d4edda"); // Light green
      statusCell.setFontColor("#155724"); // Dark green
      statusCell.setFontWeight("bold");
    } else if (data.paymentStatus === "FAILED") {
      statusCell.setBackground("#f8d7da"); // Light red
      statusCell.setFontColor("#721c24"); // Dark red
      statusCell.setFontWeight("bold");
    }

    // Auto-resize columns for better visibility
    sheet.autoResizeColumns(1, 10);

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        result: "success",
        message: "Data added successfully",
        row: sheet.getLastRow(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        result: "error",
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles GET requests (optional - for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "active",
      message: "Eljay Medical Staffing Webinar Registration API is running",
      timestamp: new Date().toISOString(),
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function to verify the script works
 * Run this from the Apps Script editor to test
 */
function testScript() {
  const testData = {
    timestamp: new Date().toISOString(),
    fullName: "Test User",
    email: "test@example.com",
    phone: "9876543210",
    qualification: "BSc Nursing, 2 years experience",
    webinarDate: "November 30, 2025",
    paymentStatus: "SUCCESS",
    paymentId: "pay_test123456",
    amount: "₹999",
    failureReason: "",
  };

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData),
    },
  };

  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
