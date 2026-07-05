import axiosInstance from './axiosInstance';

export const wastageApi = {
  findAll: () => axiosInstance.get('/wastage-rules').then(r => r.data.data),
  findById: (id) => axiosInstance.get(`/wastage-rules/${id}`).then(r => r.data.data),
  create: (data) => axiosInstance.post('/wastage-rules', data).then(r => r.data.data),
  update: (id, data) => axiosInstance.put(`/wastage-rules/${id}`, data).then(r => r.data.data),
  delete: (id) => axiosInstance.delete(`/wastage-rules/${id}`),
  preview: (data) => axiosInstance.post('/wastage-rules/preview', data).then(r => r.data.data),
};
