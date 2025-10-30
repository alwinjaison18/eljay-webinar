# 🚀 Deployment Guide

Complete guide for deploying the Eljay Medical Staffing webinar platform to production.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Razorpay **Live Mode** API keys (not test mode)
- [ ] Google Apps Script deployed and tested
- [ ] All environment variables ready
- [ ] Tested the entire flow in development
- [ ] Updated webinar date and details if needed

---

## 🌐 Option 1: Deploy to Netlify (Recommended)

### Method A: Netlify Dashboard (Easiest)

1. **Build the project locally**

   ```bash
   npm run build
   ```

2. **Create Netlify account**

   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub/GitLab/Email

3. **Deploy via Drag & Drop**

   - Go to https://app.netlify.com/drop
   - Drag the `dist` folder from your project
   - Wait for deployment to complete
   - You'll get a URL like: `https://random-name.netlify.app`

4. **Add Environment Variables**

   - Go to Site Settings → Build & Deploy → Environment
   - Click "Edit variables"
   - Add:
     - `VITE_RAZORPAY_KEY_ID` = Your live Razorpay key
     - `VITE_GOOGLE_SCRIPT_URL` = Your Google Apps Script URL
   - Click "Save"

5. **Redeploy** (if you added env vars after first deploy)

   - Go to Deploys tab
   - Click "Trigger deploy" → "Deploy site"

6. **Custom Domain (Optional)**
   - Go to Site Settings → Domain Management
   - Click "Add custom domain"
   - Follow instructions to connect your domain

### Method B: Netlify CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**

   ```bash
   netlify login
   ```

3. **Initialize and Deploy**

   ```bash
   netlify init
   netlify deploy --prod
   ```

4. **Add Environment Variables**
   ```bash
   netlify env:set VITE_RAZORPAY_KEY_ID "rzp_live_xxxxxxxxxx"
   netlify env:set VITE_GOOGLE_SCRIPT_URL "https://script.google.com/macros/s/xxxxx/exec"
   ```

### Method C: GitHub → Netlify (Continuous Deployment)

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/eljay-webinar.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to Netlify Dashboard
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables
   - Click "Deploy site"

---

## 🔷 Option 2: Deploy to Vercel

### Method A: Vercel Dashboard

1. **Build locally** (optional, for testing)

   ```bash
   npm run build
   ```

2. **Create Vercel account**

   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub/GitLab/Email

3. **Deploy**

   - Click "Add New" → "Project"
   - Import your Git repository (or upload folder)
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click "Deploy"

4. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     - `VITE_RAZORPAY_KEY_ID`
     - `VITE_GOOGLE_SCRIPT_URL`
   - Redeploy if needed

### Method B: Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login and Deploy**

   ```bash
   vercel login
   vercel --prod
   ```

3. **Add Environment Variables**
   ```bash
   vercel env add VITE_RAZORPAY_KEY_ID
   vercel env add VITE_GOOGLE_SCRIPT_URL
   ```

---

## 🎯 Option 3: Traditional Hosting (cPanel, etc.)

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Upload `dist` folder**

   - Use FTP/SFTP or cPanel File Manager
   - Upload all contents of `dist` folder to `public_html` or `www`

3. **Configure Server**

   - Ensure server serves `index.html` for all routes
   - Add `.htaccess` for Apache (see below)

4. **Apache .htaccess** (if using Apache)
   Create `.htaccess` in the root:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

**Note:** Environment variables need to be added at build time for traditional hosting.

---

## 🔐 Production Environment Variables

### Razorpay Live Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Switch to **Live Mode** (toggle at top)
3. Go to Settings → API Keys
4. Generate Live Keys
5. Use the **Key ID** (starts with `rzp_live_`)
6. **Never share the Key Secret**

### Google Apps Script

1. In your Apps Script, ensure it's deployed with "Anyone" access
2. Use the deployment URL (not the script editor URL)
3. Test it with a POST request before deploying

---

## ✅ Post-Deployment Testing

After deployment, test everything:

### 1. Form Validation

- [ ] Try submitting empty form
- [ ] Test invalid email format
- [ ] Test invalid phone number
- [ ] Test all required fields

### 2. Payment Flow

- [ ] Fill valid form data
- [ ] Click "Proceed to Payment"
- [ ] Razorpay popup opens correctly
- [ ] Company name shows: "Eljay Medical Staffing India Pvt Ltd"
- [ ] Amount shows: ₹999
- [ ] Complete a test payment

### 3. Success Flow

- [ ] Success modal appears after payment
- [ ] WhatsApp group link works
- [ ] Close modal works

### 4. Data Collection

- [ ] Check Google Sheet for new entry
- [ ] Verify all fields are captured correctly
- [ ] Check timestamp is accurate

### 5. Mobile Testing

- [ ] Test on mobile devices
- [ ] Check responsive design
- [ ] Test payment on mobile
- [ ] WhatsApp button works on mobile

### 6. General

- [ ] All animations work smoothly
- [ ] No console errors
- [ ] Fast page load
- [ ] WhatsApp floating button works

---

## 🔄 Updating the Live Site

### Netlify/Vercel (Git-based)

```bash
git add .
git commit -m "Update description"
git push
```

Site auto-deploys!

### Netlify CLI

```bash
npm run build
netlify deploy --prod
```

### Traditional Hosting

```bash
npm run build
# Upload dist folder via FTP
```

---

## 📊 Monitoring & Analytics

### Add Google Analytics (Optional)

1. Get tracking ID from Google Analytics
2. Add to `index.html` before `</head>`:
   ```html
   <!-- Google Analytics -->
   <script
     async
     src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
   ></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag() {
       dataLayer.push(arguments);
     }
     gtag("js", new Date());
     gtag("config", "G-XXXXXXXXXX");
   </script>
   ```

### Razorpay Dashboard

Monitor payments in Razorpay Dashboard:

- Go to Transactions → Payments
- View successful payments
- Download reports
- Check settlement status

### Google Sheets

- View real-time registrations
- Export data for analysis
- Create charts/pivots for insights

---

## 🐛 Common Deployment Issues

### Issue: Environment variables not working

**Solution:** Rebuild and redeploy after adding env vars

### Issue: 404 on page refresh

**Solution:** Configure server for SPA (see .htaccess above)

### Issue: Razorpay popup blocked

**Solution:** Ensure HTTPS is enabled (required for Razorpay)

### Issue: Payment works but no success modal

**Solution:** Check browser console for errors

### Issue: Google Sheets not updating

**Solution:** Verify Apps Script deployment URL and access settings

---

## 🔒 Security Checklist

- [ ] Using Razorpay **Live** keys (not test)
- [ ] Environment variables are secure
- [ ] HTTPS is enabled
- [ ] No sensitive data in client code
- [ ] Google Sheet is private (only script can write)
- [ ] `.env` is in `.gitignore`

---

## 📱 Social Media Integration

### Facebook Pixel (Optional)

Add to `index.html` for tracking:

```html
<script>
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );
  fbq("init", "YOUR_PIXEL_ID");
  fbq("track", "PageView");
</script>
```

Track payment completion in `App.jsx`:

```javascript
// In payment success handler
if (window.fbq) {
  fbq("track", "Purchase", {
    value: 999,
    currency: "INR",
  });
}
```

---

## 📞 Support

Need help with deployment?

- **Email:** eljaybangalore@gmail.com
- **Phone:** +91 7022399993
- **WhatsApp:** [Click here](https://wa.me/917022399993)

---

## 🎉 Congratulations!

Your webinar registration platform is now live! 🚀

**Share your deployment URL:**

- Facebook Ads
- Instagram Stories
- WhatsApp Groups
- Email Campaigns

**Monitor regularly:**

- Check registrations daily
- Review payment settlements
- Respond to queries promptly

**Good luck with your webinar! 🏥**
