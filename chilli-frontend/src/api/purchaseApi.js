import axiosInstance from './axiosInstance';

export const purchaseApi = {
  search: (params) => axiosInstance.get('/purchases', { params }).then(r => r.data.data),
  findById: (id) => axiosInstance.get(`/purchases/${id}`).then(r => r.data.data),
  create: (data) => axiosInstance.post('/purchases', data).then(r => r.data.data),
  update: (id, data) => axiosInstance.put(`/purchases/${id}`, data).then(r => r.data.data),
  confirm: (id) => axiosInstance.patch(`/purchases/${id}/confirm`).then(r => r.data.data),
  cancel: (id) => axiosInstance.patch(`/purchases/${id}/cancel`).then(r => r.data.data),
};
