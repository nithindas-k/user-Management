import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLogin from "./pages/admin/adminLogin";
import UserRegister from "./pages/user/UserRegister";
import UserLogin from "./pages/user/userLogin";
import Home from "./pages/user/HomePage";
import AdminDashboard from "./pages/admin/adminDashboard";
import Profile from "./pages/user/Profile";

import { setUser, clearUser } from "./redux/slices/userSlice";
import Layout from "./components/Layout";
import axiosInstance from "./api/axiosInstance";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return dispatch(clearUser());

        const { data } = await axiosInstance.post("verify-token", { token });

        const user = data.user;
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.isAdmin?"admin":"user",
          token: data.token,
          isAdmin: false,
        };

        dispatch(setUser(userData));
      } catch (error) {
        dispatch(clearUser());
      }
    };

    verifyToken();
  }, [dispatch]);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/register" element={<UserRegister />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/" element={<Home />} />

                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
