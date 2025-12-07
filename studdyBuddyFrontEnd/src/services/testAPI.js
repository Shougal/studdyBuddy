import api from "./api";

export function login(computingID, password) {
  return api.post("/login", {
    computingID,
    password,
  });
}

export function signup({ computingID, name, year, password }) {
  return api.post("/users", {
    computingID,
    name,
    year: Number(year),
    password,
  });
}
