import axiosInstance from './axiosInstance';

export const userApi = {
  findAll: (params) => axiosInstance.get('/users', { params }).then(r => r.data.data),
  findById: (id) => axiosInstance.get(`/users/${id}`).then(r => r.data.data),
  create: (data) => axiosInstance.post('/users', data).then(r => r.data.data),
  update: (id, data) => axiosInstance.put(`/users/${id}`, data).then(r => r.data.data),
  resetPassword: (id, data) => axiosInstance.put(`/users/${id}/password`, data),
};
