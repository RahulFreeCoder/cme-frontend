import axiosInstance from "./axiosinstance";

export const registerCME = async (payload) => {
  const response = await axiosInstance.post(
    "/api/CMERegistration/registerCME",
    payload,
    {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
