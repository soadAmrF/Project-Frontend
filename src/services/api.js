import api from "./axios";

// دالة مساعدة لبناء Query String للفلترة والصفحات
function buildQueryString(params = {}) {
  const query = Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== "",
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  return query ? `?${query}` : "";
}

// ////////////////// Users //////////////////
export const getUsers = () => api.get("/users");
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (data) =>
  api.post("/users", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ////////////////// Doctors //////////////////
export const getDoctors = () => api.get("/doctors");
export const getDoctor = (id) => api.get(`/doctors/${id}`);
export const createDoctor = (data) => api.post("/doctors", data);
export const updateDoctor = (id, data) => api.put(`/doctors/${id}`, data);
export const deleteDoctor = (id) => api.delete(`/doctors/${id}`);

// ////////////////// Appointments (مفرد زي الراوتر) //////////////////
export const getAppointments = () => api.get("/appointment");
export const getAppointmentById = (id) => api.get(`/appointment/${id}`);
export const createAppointment = (data) => api.post("/appointment", data);
export const updateAppointment = (id, data) =>
  api.patch(`/appointment/${id}`, data);
export const deleteAppointment = (id) => api.delete(`/appointment/${id}`);

// ////////////////// Patients (مفرد زي الراوتر) //////////////////
export const getPatients = () => api.get("/patient");
export const getPatientById = (id) => api.get(`/patient/${id}`);
export const addPatient = (patientData) => api.post("/patient", patientData);
export const updatePatient = (id, patientData) =>
  api.put(`/patient/${id}`, patientData);
export const deletePatient = (id) => api.delete(`/patient/${id}`);

// ////////////////// Medical Records (مفرد زي الراوتر) //////////////////
export const createMedicalRecord = (recordData) =>
  api.post("/medicalrecord", recordData);
export const getMedicalRecords = () => api.get("/medicalrecord");
export const getMedicalRecordById = (id) => api.get(`/medicalrecord/${id}`);
export const updateMedicalRecord = (id, data) =>
  api.put(`/medicalrecord/${id}`, data);
export const deleteMedicalRecord = (id) => api.delete(`/medicalrecord/${id}`);

// ////////////////// Inventory //////////////////
export const getAllInventory = (params) =>
  api.get(`/inventory${buildQueryString(params)}`);
export const getInventoryById = (id) => api.get(`/inventory/${id}`);
export const createInventory = (body) => api.post("/inventory", body);
export const updateInventory = (id, body) =>
  api.patch(`/inventory/${id}`, body);
export const deleteInventory = (id) => api.delete(`/inventory/${id}`);

// ////////////////// Inventory Transactions //////////////////
export const getAllInventoryTransactions = (params) =>
  api.get(`/inventory-transactions${buildQueryString(params)}`);
export const getInventoryTransactionById = (id) =>
  api.get(`/inventory-transactions/${id}`);
export const createInventoryTransaction = (body) =>
  api.post("/inventory-transactions", body);
export const updateInventoryTransaction = (id, body) =>
  api.patch(`/inventory-transactions/${id}`, body);
export const deleteInventoryTransaction = (id) =>
  api.delete(`/inventory-transactions/${id}`);

// ////////////////// Lab Tests //////////////////
export const getAllLabTests = (params) =>
  api.get(`/lab-tests${buildQueryString(params)}`);
export const getLabTestById = (id) => api.get(`/lab-tests/${id}`);
export const createLabTest = (body) => api.post("/lab-tests", body);
export const updateLabTest = (id, body) => api.patch(`/lab-tests/${id}`, body);
export const deleteLabTest = (id) => api.delete(`/lab-tests/${id}`);

// ////////////////// Lab Orders //////////////////
export const getAllLabOrders = (params) =>
  api.get(`/lab-orders${buildQueryString(params)}`);
export const getLabOrderById = (id) => api.get(`/lab-orders/${id}`);
export const createLabOrder = (body) => api.post("/lab-orders", body);
export const updateLabOrderStatus = (id, body) =>
  api.patch(`/lab-orders/${id}/status`, body);
export const addTestResult = (id, body) =>
  api.patch(`/lab-orders/${id}/result`, body);
export const cancelLabOrder = (id, body) =>
  api.patch(`/lab-orders/${id}/cancel`, body);
export const deleteLabOrder = (id) => api.delete(`/lab-orders/${id}`);

// ////////////////// Clinic Info //////////////////
export const getClinicInfo = () => api.get("/clinic-info");
export const createClinicInfo = (body) => api.post("/clinic-info", body);
export const updateClinicInfo = (body) => api.put("/clinic-info", body);

// ////////////////// Treatments //////////////////
export const getTreatments = () => api.get("/treatments");
export const getTreatmentById = (id) => api.get(`/treatments/${id}`);
export const createTreatment = (data) => api.post("/treatments", data);
export const updateTreatment = (id, data) => api.put(`/treatments/${id}`, data);
export const deleteTreatment = (id) => api.delete(`/treatments/${id}`);

// ////////////////// Auth //////////////////
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const logout = () => api.post("/auth/logout");
export const getCurrentUser = () => api.get("/auth/me");

// ////////////////// Aliases (لتجنب أخطاء الاستيراد في الملفات القديمة) //////////////////
export { getAllLabOrders as getLabOrders };
