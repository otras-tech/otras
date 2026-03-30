import apiClient from '../api/apiClient';

export async function getProfile(userId: string | number) {
    const res = await apiClient.get(`/users/${userId}`);
    return res.data;
}

export async function updateProfile(userId: string | number, data: any) {
    const res = await apiClient.patch(`/users/profile/${userId}`, data);
    return res.data;
}
