import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./features/core/pages/Home";
import Login from "./features/auth/pages/Login";
import Profile from "./features/core/pages/Profile";
import Scroll from "./components/shared/Scroll";
import Loading from "./components/ui/Loading";
import useLenis from "./hooks/useLenis";
import { useAuthStore } from "./features/auth/store/useAuthStore";
import NotFound from "./components/shared/NotFound";
import Unauthorized from "./components/shared/Unauthorized";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";
import SidebarLayout from "./components/layout/SidebarLayout";

const App = () => {
  const { getMe, isCheckingAuth } = useAuthStore();

  // Initialize Lenis smooth scroll
  // useLenis();

  // useEffect(() => {
  //   getMe();
  // }, []);

  // if (isCheckingAuth) {
  //   return (
  //     <div className="flex h-screen items-center justify-center bg-base-100">
  //       <Loading />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Toaster position="top-right" />
      <Scroll />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}

        <Route element={<SidebarLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

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
