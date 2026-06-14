import axios from "axios";
const api = axios.create({

  baseURL: "http://192.168.43.221:5000",

  headers: {

    "Content-Type": "application/json",
  },
});

// =========================================
// ATTACH JWT TOKEN
// =========================================
api.interceptors.request.use((config) => {

  const token = localStorage.getItem(

    "accessToken"
  );

  if (token) {

    config.headers.Authorization =

      `Bearer ${token}`;
  }

  return config;
});

// =========================================
// HANDLE TOKEN EXPIRY
// =========================================
api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (

      error.response?.status === 401 &&

      localStorage.getItem("accessToken")
    ) {

      localStorage.clear();

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;