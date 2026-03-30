import apiClient from '../api/apiClient';

export async function generateStudyPlan(data: any) {
    const res = await apiClient.post('/study-plan/generate', data, { timeout: 120000 });
    return res.data;
}

export async function saveStudyPlan(dto: any, aiData: any) {
    const res = await apiClient.post('/study-plan/save', { dto, aiData });
    return res.data;
}

export async function getSavedPlans(userId: string | number) {
    const res = await apiClient.get(`/study-plan/user/${userId}`);
    return res.data;
}

export async function updateActivityStatus(activityId: string | number, userId: string | number, status: any) {
    const res = await apiClient.patch(`/study-plan/activity/${activityId}`, { userId, ...status });
    return res.data;
}

export async function moveToNextDay(planId: string | number) {
    const res = await apiClient.post(`/study-plan/${planId}/next-day`);
    return res.data;
}

export async function simulateDateChange(planId: string | number) {
    const res = await apiClient.post(`/study-plan/simulate-date-change/${planId}`);
    return res.data;
}