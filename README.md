# 🏥 Eljay Medical Staffing - Webinar Registration Platform

A premium, single-page React application for collecting webinar registrations and processing payments through Razorpay. Built with React, Tailwind CSS, and Framer Motion.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16-purple)
![Razorpay](https://img.shields.io/badge/Razorpay-Integrated-3B82F6)

## ✨ Features

- **Modern Single-Page Design** - Premium, minimalist UI inspired by Razorpay's design language
- **Razorpay Payment Integration** - Secure payment gateway for ₹999 webinar registration
- **Google Sheets Integration** - Automatic data storage via Google Apps Script
- **Animated UI** - Smooth transitions and animations using Framer Motion
- **Form Validation** - Comprehensive client-side validation with user-friendly error messages
- **Responsive Design** - Mobile-first approach, works perfectly on all devices
- **WhatsApp Integration** - Floating WhatsApp button for instant support
- **Success Modal** - Animated confirmation with WhatsApp group join option

## 🎯 Purpose

This platform enables users coming from Facebook or Instagram ads to:

1. Register for the "Nursing Job Placement Webinar" (November 30th, 2025)
2. Fill in their details (Name, Email, Phone, Qualification)
3. Complete payment via Razorpay (₹999)
4. Receive confirmation and join WhatsApp group

## 🏗️ Project Structure

```
eljay-webinar/
├── public/
├── src/
│   ├── components/
│   │   ├── SuccessModal.jsx      # Animated success modal
│   │   └── WhatsAppButton.jsx    # Floating WhatsApp button
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── google-apps-script/
│   ├── Code.gs                    # Google Apps Script
│   └── SETUP_GUIDE.md            # Detailed setup instructions
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Razorpay account (for payment processing)
- Google account (for Google Sheets integration)

### Installation

1. **Clone or download this repository**

   ```bash
   cd eljay-webinar
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   copy .env.example .env
   ```

   Edit `.env` and add your credentials:

   ```env
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
   VITE_GOOGLE_SCRIPT_URL=your_google_apps_script_url_here
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:3000`

## 🔐 Razorpay Setup

1. **Create a Razorpay Account**

   - Visit [https://razorpay.com](https://razorpay.com)
   - Sign up and complete KYC verification

2. **Get API Keys**

   - Go to [Dashboard → Settings → API Keys](https://dashboard.razorpay.com/app/keys)
   - Generate keys for Test Mode (for development)
   - Generate keys for Live Mode (for production)
   - Copy the **Key ID**

3. **Add to Environment**

   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx  # Test mode
   # or
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx  # Live mode
   ```

4. **Test Payments**
   - Use Razorpay's [test cards](https://razorpay.com/docs/payments/payments/test-card-details/)
   - Test Card: 4111 1111 1111 1111
   - Any future CVV and expiry date

## 📊 Google Sheets Setup

Follow the detailed guide in `google-apps-script/SETUP_GUIDE.md`

**Quick Summary:**

1. Create a new Google Sheet
2. Go to Extensions → Apps Script
3. Copy the code from `google-apps-script/Code.gs`
4. Replace `YOUR_SHEET_ID_HERE` with your actual Sheet ID
5. Deploy as Web App with "Anyone" access
6. Copy the Web App URL to your `.env` file

## 🎨 Customization

### Colors and Branding

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',    // Main blue color
      secondary: '#10B981',   // Green for success
    }
  }
}
```

### Webinar Details

Update webinar information in `src/App.jsx`:

```javascript
const WEBINAR_DATE = "November 30, 2025";
const WEBINAR_AMOUNT = 99900; // ₹999 in paise
```

### Contact Information

Update business details in `src/App.jsx` and `src/components/SuccessModal.jsx`

## 📱 WhatsApp Integration

The floating WhatsApp button links to:

```javascript
https://wa.me/917022399993
```

To change the number, edit `src/components/WhatsAppButton.jsx`

## 🏗️ Build for Production

1. **Build the project**

   ```bash
   npm run build
   ```

   This creates an optimized production build in the `dist/` folder.

2. **Preview production build locally**
   ```bash
   npm run preview
   ```

## 🌐 Deployment

### Deploy to Netlify

1. **Via Netlify CLI**

   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

2. **Via Netlify Dashboard**
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables in Site Settings → Environment Variables

### Deploy to Vercel

1. **Via Vercel CLI**

   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Via Vercel Dashboard**
   - Go to [Vercel](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your Git repository
   - Framework Preset: Vite
   - Add environment variables

### Important: Environment Variables

Don't forget to add these to your hosting platform:

- `VITE_RAZORPAY_KEY_ID`
- `VITE_GOOGLE_SCRIPT_URL`

## 🧪 Testing

### Manual Testing Checklist

- [ ] Form validation works for all fields
- [ ] Email format validation
- [ ] Phone number validation (10 digits, starts with 6-9)
- [ ] Razorpay popup opens correctly
- [ ] Payment flow completes successfully
- [ ] Success modal appears after payment
- [ ] Data is stored in Google Sheets
- [ ] WhatsApp button works
- [ ] Responsive design on mobile
- [ ] All animations work smoothly

### Test Payment Cards (Razorpay Test Mode)

```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

## 📋 Form Fields

| Field         | Type     | Validation                           |
| ------------- | -------- | ------------------------------------ |
| Full Name     | Text     | Required, min 2 characters           |
| Email         | Email    | Required, valid email format         |
| Phone         | Tel      | Required, 10 digits, starts with 6-9 |
| Qualification | Textarea | Required                             |

## 💳 Payment Flow

1. User fills the registration form
2. Form validation runs on submission
3. Data is sent to Google Sheets (background)
4. Razorpay checkout popup opens
5. User completes payment
6. On success → Success modal shows
7. User can join WhatsApp group

## 🎨 Design System

### Typography

- **Font Family:** Inter (primary), Poppins (secondary)
- **Headings:** Bold, 24-48px
- **Body:** Regular, 16-18px

### Color Palette

- **Primary Blue:** `#3B82F6`
- **Success Green:** `#10B981`
- **Error Red:** `#EF4444`
- **Gray Scale:** `#111827` to `#F9FAFB`

### Spacing

- **Container Max Width:** 640px (2xl)
- **Padding:** 16-40px based on screen size
- **Border Radius:** 8-16px

## 🔒 Security Best Practices

- ✅ Never commit `.env` file to Git
- ✅ Use environment variables for sensitive data
- ✅ Validate all inputs on client-side
- ✅ Use HTTPS in production
- ✅ Keep Razorpay Key Secret secure (never expose it)
- ✅ Verify payments on server-side (recommended for production)

## 📞 Business Information

**Company:** Eljay Medical Staffing India Pvt Ltd  
**Email:** eljaybangalore@gmail.com  
**Phone:** +91 7022399993 / +91 6366883838  
**Webinar Date:** November 30, 2025  
**Registration Fee:** ₹999

## 🐛 Troubleshooting

### Issue: Razorpay popup not opening

**Solution:** Check that `VITE_RAZORPAY_KEY_ID` is set correctly in `.env`

### Issue: Payment successful but modal not showing

**Solution:** Check browser console for errors. Ensure Framer Motion is installed.

### Issue: Data not saving to Google Sheets

**Solution:**

- Verify Google Apps Script is deployed as "Anyone" access
- Check the Web App URL is correct in `.env`
- Look at Apps Script logs for errors

### Issue: Tailwind styles not working

**Solution:** Run `npm install` to ensure all dependencies are installed

### Issue: Build fails

**Solution:**

- Clear node_modules: `rmdir /s node_modules` then `npm install`
- Check for any syntax errors in components

## 📚 Tech Stack Details

- **React 18.2** - Modern React with hooks
- **Vite 5.0** - Fast build tool and dev server
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Framer Motion 10.16** - Animation library
- **Razorpay Checkout** - Payment gateway integration
- **Google Apps Script** - Serverless backend for Google Sheets

## 📄 License

This project is created for Eljay Medical Staffing India Pvt Ltd.

## 🤝 Support

For technical support or questions:

- Email: eljaybangalore@gmail.com
- Phone: +91 7022399993
- WhatsApp: [Click here](https://wa.me/917022399993)

---

**Built with ❤️ for Eljay Medical Staffing India Pvt Ltd**
