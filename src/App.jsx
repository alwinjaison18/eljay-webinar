import { useState, useRef } from "react";
import { motion } from "framer-motion";
import SuccessModal from "./components/SuccessModal";
import WhatsAppButton from "./components/WhatsAppButton";

function App() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualification: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Track if payment data has been sent to prevent duplicates
  const paymentDataSent = useRef(false);

  // Google Apps Script Web App URL (replace with your deployed URL)
  const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "";

  // Razorpay configuration
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit Indian phone number";
    }

    if (!formData.qualification.trim()) {
      newErrors.qualification = "Qualification/Experience is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const sendToGoogleSheets = async (data) => {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // Note: no-cors mode doesn't allow reading response, but data is sent
      return true;
    } catch (error) {
      console.error("Error sending to Google Sheets:", error);
      // Continue with payment even if sheets submission fails
      return true;
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        console.log("Razorpay SDK loaded successfully");
        resolve(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    // Check if Razorpay key is configured
    if (!RAZORPAY_KEY || RAZORPAY_KEY === "rzp_test_YOUR_KEY_HERE") {
      alert(
        "⚠️ Razorpay is not configured!\n\n" +
          "Please follow these steps:\n" +
          "1. Sign up at https://razorpay.com\n" +
          "2. Get your Test API Key from Dashboard → Settings → API Keys\n" +
          "3. Add it to the .env file as VITE_RAZORPAY_KEY_ID\n" +
          "4. Restart the development server\n\n" +
          "See GET_STARTED.md for detailed instructions."
      );
      setIsSubmitting(false);
      return;
    }

    const res = await loadRazorpay();

    if (!res) {
      alert(
        "Razorpay SDK failed to load. Please check your internet connection."
      );
      setIsSubmitting(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      amount: 99900, // Amount is in currency subunits. Default currency is INR. Hence, 99900 refers to 99900 paise or ₹999
      currency: "INR",
      name: "Eljay Medical Staffing India Pvt Ltd",
      description: "Nursing Job Placement Webinar – November 30th",
      image: "", // Add your logo URL here if available
      handler: function (response) {
        // Payment successful - response contains:
        // razorpay_payment_id, razorpay_order_id (if using orders), razorpay_signature
        console.log("Payment successful:", response);
        console.log("Payment ID:", response.razorpay_payment_id);

        // Send payment success status to Google Sheets
        // Always send success data, even if failure was logged before (in case of retry)
        const paymentData = {
          timestamp: new Date().toISOString(),
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          qualification: formData.qualification,
          webinarDate: "November 30, 2025",
          paymentStatus: "SUCCESS",
          paymentId: response.razorpay_payment_id,
          amount: "₹999",
        };

        if (GOOGLE_SCRIPT_URL) {
          sendToGoogleSheets(paymentData);
        }

        // Show success modal
        setShowSuccess(true);
        setIsSubmitting(false);

        // Optional: Send payment details to your backend for verification
        // You should verify payment on server-side in production
      },
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        qualification: formData.qualification,
        webinar_date: "November 30, 2025",
      },
      theme: {
        color: "#3B82F6",
      },
      modal: {
        ondismiss: function () {
          // Called when user closes the payment modal without completing
          console.log("Payment modal dismissed");
          setIsSubmitting(false);
        },
        // Prevent escape key from closing the modal
        escape: true,
        // Show/hide close button
        backdropclose: false,
      },
    };

    try {
      const paymentObject = new window.Razorpay(options);

      // Handle payment failure
      paymentObject.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);

        // Send payment failure status to Google Sheets only once
        const failureData = {
          timestamp: new Date().toISOString(),
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          qualification: formData.qualification,
          webinarDate: "November 30, 2025",
          paymentStatus: "FAILED",
          paymentId: response.error.metadata?.payment_id || "N/A",
          amount: "₹999",
          failureReason: response.error.description,
        };

        if (GOOGLE_SCRIPT_URL && !paymentDataSent.current) {
          paymentDataSent.current = true;
          sendToGoogleSheets(failureData);
        }

        // No alert needed - Razorpay already shows failure message
        setIsSubmitting(false);
      });

      paymentObject.open();
    } catch (error) {
      console.error("Error opening Razorpay:", error);
      alert(
        "An error occurred while opening the payment gateway. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    // Reset payment data sent flag for new payment attempt
    paymentDataSent.current = false;

    // Don't send to Google Sheets here - we'll send after payment status is determined
    // This ensures we capture the payment status (SUCCESS/FAILED)

    // Initiate payment directly
    await handlePayment();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Main Container - Two Column Layout */}
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left Section - Webinar Details */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 lg:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-xl">
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/90 text-sm font-medium tracking-wide">
                  LIMITED SEATS AVAILABLE
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight font-sora"
            >
              Nursing Job Placement
              <span className="block text-blue-200 mt-2">Webinar</span>
            </motion.h1>

            {/* Date Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 mb-8"
            >
              <svg
                className="w-6 h-6 text-blue-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  November 30, 2025
                </p>
                <p className="text-white/60 text-xs">Mark your calendar</p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-blue-50 mb-8 leading-relaxed font-space"
            >
              Learn proven strategies to secure top hospital placements in India
              and abroad. Get expert guidance from industry leaders.
            </motion.p>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4 mb-8"
            >
              {[
                "Expert-led training sessions",
                "Career advancement strategies",
                "International placement opportunities",
                "Interview preparation tips",
                "Resume building workshop",
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-blue-50 font-medium font-space">
                    {feature}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="pt-8 border-t border-white/10"
            >
              <p className="text-blue-200 font-semibold text-lg mb-2 font-sora">
                Eljay Medical Staffing India Pvt Ltd
              </p>
              <div className="space-y-1 text-blue-100/80 text-sm font-space">
                <p className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>eljaybangalore@gmail.com</span>
                </p>
                <p className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>+91 7022399993 / +91 6366883838</span>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Section - Registration Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center px-6 md:px-12 lg:px-16 py-12 bg-white"
        >
          <div className="w-full max-w-md">
            {/* Form Header */}
            <div className="mb-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 font-sora"
              >
                Reserve Your Seat
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-slate-600 text-lg font-space"
              >
                Invest in your future for just{" "}
                <span className="font-bold text-blue-600">₹999</span>
              </motion.p>
            </div>

            {/* Registration Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-slate-700 mb-2 font-space"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 font-space ${
                    errors.fullName
                      ? "border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-200 bg-white focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300"
                  } focus:ring-2 focus:outline-none transition-all duration-200`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-600 font-medium font-space">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2 font-space"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 font-space ${
                    errors.email
                      ? "border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-200 bg-white focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300"
                  } focus:ring-2 focus:outline-none transition-all duration-200`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 font-medium font-space">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-slate-700 mb-2 font-space"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 font-space ${
                    errors.phone
                      ? "border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-200 bg-white focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300"
                  } focus:ring-2 focus:outline-none transition-all duration-200`}
                  placeholder="10-digit mobile number"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600 font-medium font-space">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Qualification / Experience */}
              <div>
                <label
                  htmlFor="qualification"
                  className="block text-sm font-semibold text-slate-700 mb-2 font-space"
                >
                  Qualification / Experience{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-4 py-3.5 rounded-xl border-2 font-space ${
                    errors.qualification
                      ? "border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-200 bg-white focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300"
                  } focus:ring-2 focus:outline-none transition-all duration-200 resize-none`}
                  placeholder="e.g., BSc Nursing, 2 years experience in ICU"
                />
                {errors.qualification && (
                  <p className="mt-2 text-sm text-red-600 font-medium font-space">
                    {errors.qualification}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 font-sora ${
                  isSubmitting
                    ? "bg-slate-400 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-2xl"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Proceed to Payment (₹999)"
                )}
              </motion.button>

              {/* Trust Indicators */}
              <div className="pt-4">
                <div className="flex items-center justify-center space-x-2 text-slate-500 text-sm font-space">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure payment powered by Razorpay</span>
                </div>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}

export default App;
