import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

// ✅ Optional: Add token if using token-based auth
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   return config;
// });

// ✅ Response interceptor with error reattempt
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response && err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosInstance.get("/refresh");
        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err); // ❗️ Important: return error to caller
  }
);

export default axiosInstance;
