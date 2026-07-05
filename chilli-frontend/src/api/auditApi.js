import axiosInstance from './axiosInstance';

export const auditApi = {
  search: (params) => axiosInstance.get('/audit-logs', { params }).then(r => r.data.data),
};
