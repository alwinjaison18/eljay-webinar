import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function CancellationRefund() {
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
          Cancellation & Refund Policy
        </h1>
        <p className="text-sm text-slate-600 mb-8">
          Last updated on Oct 24 2025
        </p>

        <div className="prose prose-slate max-w-none font-spaceGrotesk">
          <p className="text-slate-700 leading-relaxed mb-6">
            ELJAY MEDICAL STAFFING INDIA PRIVATE LIMITED believes in helping its
            customers as far as possible, and has therefore a liberal
            cancellation policy. Under this policy:
          </p>

          <ul className="space-y-4 text-slate-700 mb-6">
            <li>
              Cancellations will be considered only if the request is made
              within <strong>15 days of placing the order</strong>. However, the
              cancellation request may not be entertained if the orders have
              been communicated to the vendors/merchants and they have initiated
              the process of shipping them.
            </li>
            <li>
              ELJAY MEDICAL STAFFING INDIA PRIVATE LIMITED does not accept
              cancellation requests for perishable items like flowers, eatables
              etc. However, refund/replacement can be made if the customer
              establishes that the quality of product delivered is not good.
            </li>
            <li>
              In case of receipt of damaged or defective items please report the
              same to our Customer Service team. The request will, however, be
              entertained once the merchant has checked and determined the same
              at his own end. This should be reported within{" "}
              <strong>15 days of receipt of the products</strong>.
            </li>
            <li>
              In case you feel that the product received is not as shown on the
              site or as per your expectations, you must bring it to the notice
              of our customer service within{" "}
              <strong>15 days of receiving the product</strong>. The Customer
              Service Team after looking into your complaint will take an
              appropriate decision.
            </li>
            <li>
              In case of complaints regarding products that come with a warranty
              from manufacturers, please refer the issue to them.
            </li>
            <li>
              In case of any Refunds approved by the ELJAY MEDICAL STAFFING
              INDIA PRIVATE LIMITED, it'll take <strong>3-5 days</strong> for
              the refund to be processed to the end customer.
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default CancellationRefund;
