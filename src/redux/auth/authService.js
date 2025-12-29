import axiosInstance from "../../services/axiosinstance";

export const loginApi = async ({ email, password }) => {
  const response = await axiosInstance.post("/api/Auth/user/login", {
    email,
    password,
  });

  return {
    status: response.status,
    token: response.data.jwttoken,
    user: response.data.user,
  };
};

export const registerApi = async (formData) => {
  const [firstName, ...last] = formData.name.trim().split(" ");
  const lastName = last.join(" ") || "";

  const payload = {
    id: "",
    username: formData.email,
    password: formData.password,
    prefix: formData.prefix, 
    firstName,
    lastName,
    specialization: formData.userType === "doctor" ? "General" : "",
    email: formData.email,
    mobile: formData.phone,
    userRole: formData.userType.toUpperCase(),
    resetPasswordToken: "",
  };

  const response = await axiosInstance.post("/user/signup", payload);
  return response.data;
};