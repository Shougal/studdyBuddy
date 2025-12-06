import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/studdybuddy/api", // base url before any endpoint call
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
