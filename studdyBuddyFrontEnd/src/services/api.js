import axios from "axios";

const api = axios.create({
  baseURL: "https://www.cs.virginia.edu/~xdq9qa/api", // base url before any endpoint call
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
