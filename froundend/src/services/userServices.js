
import axiosInstance from "../api/axiosInstance";
import { API_ROUTES } from "../utils/constants";


export const loginUser = async (formData) => {
  const res = await axiosInstance.post(API_ROUTES.LOGIN, formData)
  return res.data
}

export const updateUserProfile = async (id, data, token) => {
  const res = await axiosInstance.put(API_ROUTES.PROFILE_UPDATE(id), data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const adminLogin = async (formData) => {
  const res = await axiosInstance.post(API_ROUTES.ADMIN_LOGIN, formData);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axiosInstance.get(API_ROUTES.GET_ALL_USERS, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })

  return res.data
}

export const deleteUser = async (userID) => {
  const token = localStorage.getItem("token");

  const res = await axiosInstance.delete(API_ROUTES.DELETE_USER(userID), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createUser = async (data) => {
  const token = localStorage.getItem("token");
  const res = await axiosInstance.post(API_ROUTES.CREATE_USER, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateUser = async (userID, data) => {
  const token = localStorage.getItem("token");
  const res = await axiosInstance.put(API_ROUTES.UPDATE_USER(userID), data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};




export const registerUser = async (formData) => {
  const response = await axiosInstance.post(API_ROUTES.REGISTER, formData);
  return response.data;
};

