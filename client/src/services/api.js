import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const createCase = async (premise, difficulty) => {
  const response = await api.post('/cases', { premise, difficulty });
  return response.data;
};

export const getCases = async () => {
  const response = await api.get('/cases');
  return response.data;
};

export const getCaseById = async (id) => {
  const response = await api.get(`/cases/${id}`);
  return response.data;
};

export const discoverClue = async (caseId, clueId) => {
  const response = await api.post(`/cases/${caseId}/clues/${clueId}/discover`);
  return response.data;
};

export const requestHint = async (caseId) => {
  const response = await api.post(`/cases/${caseId}/hints`);
  return response.data;
};

export const submitAccusation = async (caseId, suspectId, rationale) => {
  const response = await api.post(`/cases/${caseId}/accuse`, {
    suspectId,
    rationale,
  });
  return response.data;
};

export const getCaseResult = async (caseId) => {
  const response = await api.get(`/cases/${caseId}/result`);
  return response.data;
};

export default api;
