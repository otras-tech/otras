import apiClient from '../api/apiClient';

export async function getAdminStats() {
    const [uResp, eResp, jResp, tResp, sResp] = await Promise.all([
        apiClient.get("/users"),
        apiClient.get("/exams"),
        apiClient.get("/jobs"),
        apiClient.get("/test"),
        apiClient.get("/subscriptions"),
    ]);

    return {
        users: uResp.data.length,
        exams: eResp.data.length,
        jobs: jResp.data.length,
        tests: tResp.data.length,
        subscriptions: sResp.data.length,
        activeToday: 142, // Mocked for now
        conversion: "18.4%", // Mocked for now
    };
}

export async function getUsers() {
    const res = await apiClient.get("/users");
    return res.data;
}

export async function getJobs() {
    const res = await apiClient.get("/jobs");
    return res.data;
}

export async function getExams() {
    const res = await apiClient.get("/exams");
    return res.data;
}

export async function deleteUser(id: number | string) {
    await apiClient.delete(`/users/${id}`);
}

export async function getSubjects() {
    const res = await apiClient.get("/subjects");
    return res.data;
}

export async function createSubject(data: any) {
    const res = await apiClient.post("/subjects", data);
    return res.data;
}

export async function updateSubject(id: number | string, data: any) {
    const res = await apiClient.patch(`/subjects/${id}`, data);
    return res.data;
}

export async function deleteSubject(id: number | string) {
    await apiClient.delete(`/subjects/${id}`);
}

export async function createExam(data: any) {
    const res = await apiClient.post("/exams", data);
    return res.data;
}

export async function updateExam(id: number | string, data: any) {
    const res = await apiClient.patch(`/exams/${id}`, data);
    return res.data;
}

export async function deleteExam(id: number | string) {
    await apiClient.delete(`/exams/${id}`);
}

export async function getTests() {
    const res = await apiClient.get("/test");
    return res.data;
}

export async function getTestPreview(examId: number | string) {
    const res = await apiClient.get(`/test/preview/${examId}`);
    return res.data;
}

export async function createTest(data: any) {
    const res = await apiClient.post("/test", data);
    return res.data;
}

export async function updateTest(id: number | string, data: any) {
    const res = await apiClient.patch(`/test/${id}`, data);
    return res.data;
}

export async function deleteTest(id: number | string) {
    await apiClient.delete(`/test/${id}`);
}

export async function createJob(data: any) {
    const res = await apiClient.post("/jobs", data);
    return res.data;
}

export async function deleteJob(id: number | string) {
    await apiClient.delete(`/jobs/${id}`);
}

export async function getQuestions(filters: any) {
    const params = new URLSearchParams();
    if (filters.subjectId) params.append('subjectId', filters.subjectId);
    if (filters.examId) params.append('examId', filters.examId);
    const res = await apiClient.get(`/question?${params.toString()}`);
    return res.data;
}

export async function createQuestion(data: any) {
    const res = await apiClient.post("/question", data);
    return res.data;
}

export async function updateQuestion(id: number | string, data: any) {
    const res = await apiClient.patch(`/question/${id}`, data);
    return res.data;
}

export async function deleteQuestion(id: number | string) {
    await apiClient.delete(`/question/${id}`);
}

export async function getSubscriptions() {
    const res = await apiClient.get("/subscriptions");
    return res.data;
}

export async function createSubscription(data: any) {
    const res = await apiClient.post("/subscriptions", data);
    return res.data;
}

export async function updateSubscription(id: number | string, data: any) {
    const res = await apiClient.patch(`/subscriptions/${id}`, data);
    return res.data;
}

export async function deleteSubscription(id: number | string) {
    await apiClient.delete(`/subscriptions/${id}`);
}

export async function getPyps() {
    const res = await apiClient.get("/pyps");
    return res.data;
}

export async function createPyp(data: any) {
    const res = await apiClient.post("/pyps", data);
    return res.data;
}

export async function deletePyp(id: number | string) {
    await apiClient.delete(`/pyps/${id}`);
}

export async function getReferrals() {
    const res = await apiClient.get("/referrals/admin/all");
    return res.data;
}
