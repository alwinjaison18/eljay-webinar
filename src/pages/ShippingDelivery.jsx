import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function ShippingDelivery() {
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
          Shipping & Delivery Policy
        </h1>
        <p className="text-sm text-slate-600 mb-8">
          Last updated on Oct 24 2025
        </p>

        <div className="prose prose-slate max-w-none font-spaceGrotesk">
          <p className="text-slate-700 leading-relaxed mb-4">
            For International buyers, orders are shipped and delivered through
            registered international courier companies and/or International
            speed post only.
          </p>

          <p className="text-slate-700 leading-relaxed mb-4">
            For domestic buyers, orders are shipped through registered domestic
            courier companies and/or speed post only.
          </p>

          <p className="text-slate-700 leading-relaxed mb-4">
            Orders are shipped within <strong>22-35 days</strong> or as per the
            delivery date agreed at the time of order confirmation and
            delivering of the shipment subject to Courier Company / post office
            norms.
          </p>

          <p className="text-slate-700 leading-relaxed mb-4">
            ELJAY MEDICAL STAFFING INDIA PRIVATE LIMITED is not liable for any
            delay in delivery by the courier company / postal authorities and
            only guarantees to hand over the consignment to the courier company
            or postal authorities within 22-35 days from the date of the order
            and payment or as per the delivery date agreed at the time of order
            confirmation.
          </p>

          <p className="text-slate-700 leading-relaxed mb-4">
            Delivery of all orders will be to the address provided by the buyer.
          </p>

          <p className="text-slate-700 leading-relaxed mb-4">
            Delivery of our services will be confirmed on your mail ID as
            specified during registration.
          </p>

          <p className="text-slate-700 leading-relaxed">
            For any issues in utilizing our services you may contact our
            helpdesk on <strong>7022399993</strong> or{" "}
            <a
              href="mailto:eljaybangalore@gmail.com"
              className="text-blue-600 hover:text-blue-700"
            >
              eljaybangalore@gmail.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default ShippingDelivery;
