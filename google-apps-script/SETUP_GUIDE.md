# Google Apps Script Setup Guide

This guide will help you set up Google Sheets integration for the Eljay Medical Staffing webinar registration system.

## 📋 Prerequisites

- A Google account
- Access to Google Sheets
- The `Code.gs` file from this directory

## 🚀 Step-by-Step Setup

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"Blank"** to create a new spreadsheet
3. Name it **"Eljay Webinar Registrations"**
4. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
   The Sheet ID is the long string between `/d/` and `/edit`

### Step 2: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. You'll see a new tab open with the Apps Script editor
3. Delete any existing code in the editor

### Step 3: Add the Script

1. Copy the entire contents of `Code.gs`
2. Paste it into the Apps Script editor
3. **Important:** Find this line in the code:
   ```javascript
   const SHEET_ID = "YOUR_SHEET_ID_HERE";
   ```
4. Replace `YOUR_SHEET_ID_HERE` with your actual Sheet ID (from Step 1)
5. Click the **Save** button (💾 icon)
6. Name your project: **"Webinar Registration API"**

### Step 4: Deploy as Web App

1. Click the **Deploy** button (top right corner)
2. Select **"New deployment"**
3. Click the gear icon (⚙️) next to **"Select type"**
4. Choose **"Web app"**
5. Fill in the deployment settings:
   - **Description:** `Webinar Registration API`
   - **Execute as:** `Me (your email)`
   - **Who has access:** `Anyone`
6. Click **"Deploy"**
7. **Authorize the app:**
   - Click **"Authorize access"**
   - Choose your Google account
   - Click **"Advanced"** → **"Go to [Project Name] (unsafe)"**
   - Click **"Allow"**
8. **Copy the Web App URL** that appears (it looks like this):
   ```
   https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec
   ```

### Step 5: Test the Deployment (Optional)

1. In the Apps Script editor, select the function **`testScript`** from the dropdown
2. Click the **"Run"** button (▶️)
3. Check your Google Sheet - you should see a test row added
4. If successful, delete the test row

### Step 6: Add URL to React App

1. In your React project root, create a file named **`.env`**
2. Add the following line (replace with your actual Web App URL):
   ```env
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/[YOUR_DEPLOYMENT_ID]/exec
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```
3. Save the file
4. **Restart your development server** for changes to take effect

## 📊 Sheet Structure

The script automatically creates the following columns:

| Timestamp | Full Name | Email | Phone | Qualification/Experience | Webinar Date |
| --------- | --------- | ----- | ----- | ------------------------ | ------------ |

## 🔧 Troubleshooting

### Issue: "Authorization required"

**Solution:** Make sure you've authorized the script in Step 4.7

### Issue: "Access denied"

**Solution:** Check that "Who has access" is set to "Anyone" in deployment settings

### Issue: "Sheet not found"

**Solution:** Verify that you replaced `YOUR_SHEET_ID_HERE` with your actual Sheet ID

### Issue: No data appearing in sheet

**Solution:**

- Check that the Web App URL is correctly added to `.env`
- Verify the sheet tab name matches `SHEET_NAME` in the script (default: "Registrations")
- Check the Apps Script logs: View → Logs

### Issue: CORS errors in browser

**Solution:** This is expected with `no-cors` mode. Data is still being sent successfully.

## 🔄 Updating the Script

If you need to modify the script later:

1. Make changes in the Apps Script editor
2. Save your changes
3. Click **Deploy** → **Manage deployments**
4. Click the **Edit** button (pencil icon) next to your deployment
5. Change the version to **"New version"**
6. Click **"Deploy"**

**Note:** The Web App URL remains the same when updating.

## 📧 Email Notifications (Optional Enhancement)

To send email confirmations when someone registers, add this function to your script:

```javascript
function sendConfirmationEmail(email, name) {
  const subject = "Webinar Registration Confirmation - Eljay Medical Staffing";
  const body = `Dear ${name},\n\nThank you for registering for the Nursing Job Placement Webinar on November 30, 2025.\n\nWebinar Details:\nDate: November 30, 2025\nTime: [Add time]\n\nWe look forward to seeing you!\n\nBest regards,\nEljay Medical Staffing India Pvt Ltd\neljaybangalore@gmail.com\n+91 7022399993`;

  MailApp.sendEmail(email, subject, body);
}
```

Then call it in the `doPost` function after appending the row:

```javascript
sendConfirmationEmail(data.email, data.fullName);
```

## 📞 Support

For any issues, contact:

- Email: eljaybangalore@gmail.com
- Phone: +91 7022399993 / +91 6366883838
