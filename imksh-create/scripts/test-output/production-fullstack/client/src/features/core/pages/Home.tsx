import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiZap, FiLayers, FiCpu, FiShield, FiArrowRight } from "react-icons/fi";
import appConfig from "../../../config/index";
import toast from "react-hot-toast";
import { useState } from "react";

const Home = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="h-full w-full relative overflow-hidden flex flex-col items-center justify-center  p-6 text-base-content">
      {/* Hero Welcome Section */}
      <div className="max-w-3xl w-full text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-2"
        >
          <div className="bg-primary/10 text-primary p-2.5 rounded-2xl">
            <img
              src={appConfig.app.logo}
              alt={appConfig.app.name}
              className="w-8 h-8 rounded-full"
            />
          </div>
          <span className="text-sm font-semibold tracking-widest uppercase text-primary-content/65">
            React Starter Kit
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black tracking-tight text-base-content"
        >
          Welcome to {appConfig.app.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-base-content/70 max-w-xl mx-auto leading-relaxed"
        >
          A production-ready React setup built using <strong>@imksh/cli</strong>
          . Everything is pre-configured and ready to publish.
        </motion.p>
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full my-10 shrink-0"
      >
        {/* Card 1 */}
        <div className="bg-base-200/50 backdrop-blur border border-base-content/10 p-5 rounded-2xl flex flex-col gap-3 hover:bg-base-200 transition-colors">
          <div className="text-primary text-xl">
            <FiLayers />
          </div>
          <div>
            <h3 className="text-sm font-bold text-base-content">Zustand & UI</h3>
            <p className="text-xs text-base-content/70 mt-1">
              Light/Dark theme, sidebar collapse & responsive menu states.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-base-200/50 backdrop-blur border border-base-content/10 p-5 rounded-2xl flex flex-col gap-3 hover:bg-base-200 transition-colors">
          <div className="text-success text-xl">
            <FiZap />
          </div>
          <div>
            <h3 className="text-sm font-bold text-base-content">Tailwind & UI</h3>
            <p className="text-xs text-base-content/70 mt-1">
              Tailwind CSS v4 + FlyonUI components pre-configured.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-base-200/50 backdrop-blur border border-base-content/10 p-5 rounded-2xl flex flex-col gap-3 hover:bg-base-200 transition-colors">
          <div className="text-warning text-xl">
            <FiCpu />
          </div>
          <div>
            <h3 className="text-sm font-bold text-base-content">Layouts & Router</h3>
            <p className="text-xs text-base-content/70 mt-1">
              Public & Dashboard layouts with dynamic headers.
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-base-200/50 backdrop-blur border border-base-content/10 p-5 rounded-2xl flex flex-col gap-3 hover:bg-base-200 transition-colors">
          <div className="text-error text-xl">
            <FiShield />
          </div>
          <div>
            <h3 className="text-sm font-bold text-base-content">Helpers</h3>
            <p className="text-xs text-base-content/70 mt-1">
              Modal system, Tables, Loading Skeletons, and Auth Services.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Call to Actions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex gap-4"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setCount((prev) => prev + 1)}
          className="btn btn-primary rounded-xl px-6 py-2.5 font-semibold text-sm gap-2 shadow-lg shadow-primary/20 flex items-center transition-all"
        >
          count {count}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => toast.success("Hello World")}
          className="btn btn-outline rounded-xl px-6 py-2.5 font-semibold text-sm gap-2 flex items-center transition-all border-base-content/20 text-base-content hover:bg-base-content/5"
        >
          Show Toast
        </motion.button>
      </motion.div>

      {/* Footer Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute bottom-6 text-xs text-base-content/50 font-medium"
      >
        Generated with @imksh/cli • Version {appConfig.app.version}
      </motion.div>
    </div>
  );
};

export default Home;
