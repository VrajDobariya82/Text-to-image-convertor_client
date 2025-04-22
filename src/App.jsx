import React, { useContext, useEffect } from "react";
import Home from "./pages/Home";
import Result from "./pages/Result";
import BuyCredit from "./pages/BuyCredit";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { AppContext } from "./context/AppContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Profile from "./pages/Profile";

const App = () => {
  const { showLogin, darkMode } = useContext(AppContext);
  
  // Update toast theme when dark mode changes
  useEffect(() => {
    // Force toasts to update their theme
    toast.dismiss();
  }, [darkMode]);
  
  return (
    <div
      className="px-4 sm:px-10 md:px-14 lg:px-28 
    min-h-screen bg-gradient-to-b from-teal-50 to-orange-50 dark:from-neutral-900 dark:to-neutral-800 transition-colors duration-300"
    >
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme={darkMode ? "dark" : "light"}
        pauseOnHover={false}
      />
      <Navbar />
      {showLogin && <Login />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/buy" element={<BuyCredit />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
