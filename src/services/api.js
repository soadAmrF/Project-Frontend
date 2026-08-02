import api from "./axios";

// ////////////// Users ////////////////////

export const getUsers = () => api.get("/users");

export const getUser = (id) => api.get(`/users/${id}`);

export const createUser = (data) =>
  api.post("/users", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteUser = (id) => api.delete(`/users/${id}`);

//  ///////////////////// Doctors ///////////////

export const getDoctors = () => api.get("/doctors");

export const getDoctor = (id) => api.get(`/doctors/${id}`);

export const createDoctor = (data) => api.post("/doctors", data);

export const updateDoctor = (id, data) => api.put(`/doctors/${id}`, data);

export const deleteDoctor = (id) => api.delete(`/doctors/${id}`);
