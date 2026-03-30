import apiClient from '../api/apiClient';

export async function getExams() {
    const res = await apiClient.get('/exams');
    return res.data;
}

export async function getJobs() {
    const res = await apiClient.get('/jobs');
    return res.data;
}

export async function getExamById(id: string | number) {
    const res = await apiClient.get(`/exams/${id}`);
    return res.data;
}
