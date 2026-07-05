import axiosInstance from './axiosInstance';

export const reportApi = {
  bySeller: (params) => axiosInstance.get('/reports/purchase-by-seller', { params }).then(r => r.data.data),
  byChilli: (params) => axiosInstance.get('/reports/purchase-by-chilli', { params }).then(r => r.data.data),
};
