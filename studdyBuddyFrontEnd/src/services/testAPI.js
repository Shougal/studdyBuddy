import api from "./api";

export function login(computingID, password) {
  return api.post("/login", {
    computingID,
    password,
  });
}
