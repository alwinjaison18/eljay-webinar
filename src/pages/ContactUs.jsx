import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12"
      >
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-spaceGrotesk"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-soraBold text-slate-900 mb-4">
          Contact Us
        </h1>
        <p className="text-sm text-slate-600 mb-8">
          Last updated on Oct 24 2025
        </p>

        <div className="prose prose-slate max-w-none font-spaceGrotesk">
          <p className="text-slate-700 leading-relaxed mb-8">
            You may contact us using the information below:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-soraBold text-slate-900 mb-2">
                Merchant Legal Entity Name
              </h3>
              <p className="text-slate-700">
                ELJAY MEDICAL STAFFING INDIA PRIVATE LIMITED
              </p>
            </div>

            <div>
              <h3 className="text-lg font-soraBold text-slate-900 mb-2">
                Registered Address
              </h3>
              <p className="text-slate-700">
                No. 7 AYAPPA NAGARA SM ROAD JALAHALLI WEST NA
                <br />
                Bangalore BANGALORE Karnataka India 560015
                <br />
                Jalahalli West KARNATAKA 560015
              </p>
            </div>

            <div>
              <h3 className="text-lg font-soraBold text-slate-900 mb-2">
                Operational Address
              </h3>
              <p className="text-slate-700">
                #12, Grand Majestic Mall, 2nd Cross
                <br />
                Opp. Gubbi Veeranna Theater, Gandhinagar
                <br />
                Bengaluru – 560009
                <br />
                Bengaluru KARNATAKA 560009
              </p>
            </div>

            <div>
              <h3 className="text-lg font-soraBold text-slate-900 mb-2">
                Telephone
              </h3>
              <p className="text-slate-700">
                <a
                  href="tel:7022399993"
                  className="text-blue-600 hover:text-blue-700"
                >
                  7022399993
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-soraBold text-slate-900 mb-2">
                Email
              </h3>
              <p className="text-slate-700">
                <a
                  href="mailto:eljaybangalore@gmail.com"
                  className="text-blue-600 hover:text-blue-700"
                >
                  eljaybangalore@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ContactUs;
