import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://pravinwadeusa-001-site1.stempurl.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

export default axiosInstance;
  
