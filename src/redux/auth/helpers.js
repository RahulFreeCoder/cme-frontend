export const getStoredToken = () => {
  try {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
      return null;
    }

    return token;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

//return true, TBD- validate date expiry in furtue
export const isTokenValid = (token) => {
  try {
    // const payload = JSON.parse(atob(token.split(".")[1]));
    // return payload.exp * 1000 > Date.now();
    return true;
  } catch {
    return false;
  }
};

  export const getStoredUser = () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  };
