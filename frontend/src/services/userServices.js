import axiosInstance from "../api/axiosInstance";
import { API_ROUTES } from "../utils/constants";

export const loginUser = async (formData) => {
  const res = await axiosInstance.post(API_ROUTES.LOGIN, formData);
  return res.data;
};

export const registerUser = async (formData) => {
  const res = await axiosInstance.post(API_ROUTES.REGISTER, formData);
  return res.data;
};

export const adminLogin = async (formData) => {
  const res = await axiosInstance.post(API_ROUTES.ADMIN_LOGIN, formData);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axiosInstance.get(API_ROUTES.GET_ALL_USERS);
  return res.data;
};

export const deleteUser = async (userID) => {
  const res = await axiosInstance.delete(API_ROUTES.DELETE_USER(userID));
  return res.data;
};

export const createUser = async (data) => {
  const res = await axiosInstance.post(API_ROUTES.CREATE_USER, data);
  return res.data;
};

export const updateUser = async (userID, data) => {
  const res = await axiosInstance.put(API_ROUTES.UPDATE_USER(userID), data);
  return res.data;
};
export const updateUserProfile = async (data) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  };

  const res = await axiosInstance.put(API_ROUTES.PROFILE_UPDATE, data, config);
  return res.data;
};


export const logoutUser = async () => {
  const res = await axiosInstance.post(API_ROUTES.LOGOUT);
  return res.data;
};
