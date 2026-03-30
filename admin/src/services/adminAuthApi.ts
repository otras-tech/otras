import apiClient from '../api/apiClient';

export async function adminLogin(data: any) {
    const res = await apiClient.post('/admin/auth/login', data);
    return res.data;
}

export async function adminRegister(data: any) {
    const res = await apiClient.post('/admin/auth/register', data);
    return res.data;
}
