import axios from "axios";

const api = axios.create({
 baseURL: "http://localhost/studdybuddy/api", // base url before any endpoint call
 //baseURL: "https://www.cs.virginia.edu/~xdq9qa/studdybuddy/api",
 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
