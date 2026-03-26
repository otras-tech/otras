const BACKEND_URL = "http://localhost:4000";

export async function generateStudyPlan(data) {
    const res = await fetch(`${BACKEND_URL}/study-plan/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to generate plan");
    }
    return res.json();
}

export async function saveStudyPlan(dto, aiData) {
    const res = await fetch(`${BACKEND_URL}/study-plan/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dto, aiData })
    });
    if (!res.ok) throw new Error("Failed to save plan");
    return res.json();
}

export async function getSavedPlans(userId) {
    const res = await fetch(`${BACKEND_URL}/study-plan/user/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch saved plans");
    return res.json();
}

export async function updateActivityStatus(activityId, userId, status) {
    const res = await fetch(`${BACKEND_URL}/study-plan/activity/${activityId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...status })
    });
    if (!res.ok) throw new Error("Failed to update activity");
    return res.json();
}

export async function moveToNextDay(planId) {
    const res = await fetch(`${BACKEND_URL}/study-plan/${planId}/next-day`, {
        method: "POST"
    });
    if (!res.ok) throw new Error("Failed to move to next day");
    return res.json();
}

export async function simulateDateChange(planId) {
    const res = await fetch(`${BACKEND_URL}/study-plan/simulate-date-change/${planId}`, {
        method: "POST"
    });
    if (!res.ok) throw new Error("Failed to simulate date change");
    return res.json();
}