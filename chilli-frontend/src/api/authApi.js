import axiosInstance from './axiosInstance';

export const authApi = {
  login: async (username, password) => {
    const { data } = await axiosInstance.post('/auth/login', { username, password });
    return data.data;
  },
  me: async () => {
    const { data } = await axiosInstance.get('/auth/me');
    return data.data;
  },
};
