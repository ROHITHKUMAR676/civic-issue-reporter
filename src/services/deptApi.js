import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ STATS
export const getDeptStats = () =>
  API.get("/issues/dept/stats");

// ✅ ISSUES
export const getDeptIssues = () =>
  API.get("/issues/dept/issues");

// ✅ UPDATE STATUS
export const updateDeptIssueStatus = (id, status) =>
  API.put(`/issues/dept/issues/${id}`, { status });

// ✅ UPLOAD PROOF
export const uploadDeptProof = (id, formData) =>
  API.post(`/issues/dept/issues/${id}/proof`, formData);

export default API;
