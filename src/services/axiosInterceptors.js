import axiosInstance  from "./axiosinstance";
import { logout } from "../redux/auth/authSlice";

export const setupInterceptors = (store) => {
  axiosInstance.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }
  );
};
