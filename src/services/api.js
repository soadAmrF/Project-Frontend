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

// ////////////// Appointments ////////////////////

export const getAppointments = () => api.get("/appointments");

export const createAppointment = (data) => api.post("/appointments", data);

export const updateAppointment = (id, data) =>
  api.patch(`/appointments/${id}`, data);

export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

// Patients API Endpoints
export const getPatients = () => api.get("/patients");
export const getPatientById = (id) => api.get(`/patients/${id}`);
export const addPatient = (patientData) => api.post("/patients", patientData);
export const updatePatient = (id, patientData) =>
  api.put(`/patients/${id}`, patientData);

// Medical Records API
export const createMedicalRecord = (recordData) =>
  api.post("/medical-records", recordData);
export const getMedicalRecords = () => api.get("/medical-records");

// ////////////// Treatments ////////////////////

export const getTreatments = () => api.get("/treatments");

export const getTreatmentById = (id) => api.get(`/treatments/${id}`);

export const createTreatment = (data) => api.post("/treatments", data);

export const updateTreatment = (id, data) => api.put(`/treatments/${id}`, data);

export const deleteTreatment = (id) => api.delete(`/treatments/${id}`);

// ////////////// Lab Orders ////////////////////
export const getLabOrders = async () => {
  return await axios.get("/api/lab-orders"); // استبدل المسار بما يتوافق مع API الـ Express لديك
};
