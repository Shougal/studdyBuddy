import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL: "http://localhost/studdybuddy/api",
=======
  baseURL: "http://localhost/studdybuddy/api", // base url before any endpoint call
>>>>>>> main
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
