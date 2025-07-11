import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
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
        const { data } = await axiosInstance.post("verify-token");

        const user = data.user;
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.isAdmin ? "admin" : "user",
          token: data.token,
          isAdmin: user.isAdmin,
          avatar: user.avatar,
        };

        dispatch(setUser(userData));
      } catch (error) {
        dispatch(clearUser());
        // toast.error("Session expired. Please log in again.");
        // navigate("/admin/login");
      }
    };

    verifyToken();
  }, [dispatch]);

  return (
    <>
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
    </>
  );
};

export default App;
