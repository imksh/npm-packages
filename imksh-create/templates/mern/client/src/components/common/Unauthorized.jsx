import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaLock } from "react-icons/fa6";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-6">
      <div className="max-w-lg text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 12,
          }}
          className="mx-auto mb-6 w-24 h-24 rounded-full bg-warning/15 flex items-center justify-center"
        >
          <FaLock className="text-5xl text-warning" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl font-black text-warning"
        >
          401
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-3xl font-bold"
        >
          Unauthorized
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.3 }}
          className="mt-3 text-base-content/70"
        >
          You don't have permission to access this page. Please sign in with an
          authorized account.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Link to="/login" className="btn btn-warning">
            Sign In
          </Link>

          <Link to="/" className="btn btn-outline">
            Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="btn btn-ghost gap-2"
          >
            <FaArrowLeft />
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Unauthorized;
