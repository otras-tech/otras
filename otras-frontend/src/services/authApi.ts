import apiClient from '../api/apiClient';

export async function register(data: any) {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
}

export async function login(data: any) {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
}
