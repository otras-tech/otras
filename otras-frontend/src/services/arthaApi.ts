import apiClient from '../api/apiClient';

export async function getArthaStatus(userId: string | number) {
    const res = await apiClient.get(`/artha/status/${userId}`);
    return res.data;
}

export async function getRandomTest(examId: string | number) {
    const res = await apiClient.get(`/exams/${examId}/random-test`);
    return res.data;
}
