import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Scroll from "./components/common/Scroll";
import Loading from "./components/common/Loading";
import useLenis from "./hooks/useLenis";
import { useAuthStore } from "./store/useAuthStore";
import NotFound from "./components/common/NotFound";
import Unauthorized from "./components/common/Unauthorized";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";
import SidebarLayout from "./components/layout/SidebarLayout";

const App = () => {
  const { getMe, isCheckingAuth } = useAuthStore();

  // Initialize Lenis smooth scroll
  // useLenis();

  useEffect(() => {
    getMe();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-100">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Toaster position="top-right" />
      <Scroll />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route> */}

        {/* Auth Page Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes wrapped in ProtectedRoute and SidebarLayout */}
        <Route
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback Route */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
