"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft, FaHouse } from "react-icons/fa6";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-6">
      <div className="max-w-lg text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 120,
          }}
          className="text-8xl md:text-9xl font-black text-primary"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 text-3xl font-bold"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.3 }}
          className="mt-3 text-base-content/70"
        >
          Sorry, the page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Link href="/" className="btn btn-primary gap-2">
            <FaHouse />
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="mt-16 text-8xl font-black text-base-300 select-none"
        >
          ?
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;