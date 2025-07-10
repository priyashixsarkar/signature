import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this to your hosted URL in production
});

// Register API
export const register = (data) => API.post('/auth/register', data);

// Login API
export const login = (data) => API.post('/auth/login', data);

// Fetch all documents
export const fetchDocuments = (token) => {
  return API.get('/docs', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Sign a document
export const signDocument = (id, token) => {
  return API.post(`/docs/sign/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Upload a document
export const uploadDocument = (file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  return API.post('/docs/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};
