// services/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// ----------------------
// User Authentication
// ----------------------
export const login = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  return response.data;
};

// ----------------------
// Account Transactions
// ----------------------
export const withdraw = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/account/withdraw`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const deposit = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/account/deposit`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const fetchBalance = async () => {
  const response = await axios.get(`${API_BASE_URL}/account/balance`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const fetchMiniStatement = async () => {
  const response = await axios.get(`${API_BASE_URL}/account/mini-statement`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const resetPin = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/account/pin-reset`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const getAccountStatement = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(
    `${API_BASE_URL}/account/account-statement?${params}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return response.data;
};

// ----------------------
// Admin APIs
// ----------------------
export const adminLogin = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/admin/login`, credentials);
  return response.data;
};

export const refillATM = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/auth/refill-atm`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const getATMStatus = async () => {
  const response = await axios.get(`${API_BASE_URL}/auth/atm-status`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};
