import axiosInstance from './axiosInstance';

export const partyApi = {
  search: (params) => axiosInstance.get('/parties', { params }).then(r => r.data.data),
  sellers: () => axiosInstance.get('/parties/sellers').then(r => r.data.data),
  buyers: () => axiosInstance.get('/parties/buyers').then(r => r.data.data),
  findById: (id) => axiosInstance.get(`/parties/${id}`).then(r => r.data.data),
  create: (data) => axiosInstance.post('/parties', data).then(r => r.data.data),
  update: (id, data) => axiosInstance.put(`/parties/${id}`, data).then(r => r.data.data),
  toggleStatus: (id, active) => axiosInstance.patch(`/parties/${id}/status`, null, { params: { active } }),
};
