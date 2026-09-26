import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const api = {
  uploadPcap: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  triggerAnalysis: async (analysisId) => {
    const response = await apiClient.post(`/analyze/${analysisId}`);
    return response.data;
  },

  getDemo: async (scenario) => {
    const response = await apiClient.get(`/demo/${scenario}`);
    return response.data;
  },

  getAnalysis: async (analysisId) => {
    const response = await apiClient.get(`/analysis/${analysisId}`);
    return response.data;
  },

  getSummary: async (analysisId) => {
    const response = await apiClient.get(`/analysis/${analysisId}/summary`);
    return response.data;
  },

  getSessions: async (analysisId) => {
    const response = await apiClient.get(`/analysis/${analysisId}/sessions`);
    return response.data;
  },

  getFindings: async (analysisId) => {
    const response = await apiClient.get(`/analysis/${analysisId}/findings`);
    return response.data;
  },

  getReport: async (analysisId) => {
    const response = await apiClient.get(`/analysis/${analysisId}/report/json`);
    return response.data;
  },
};
