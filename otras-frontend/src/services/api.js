export async function generateRoadmap(data) {

    return fetch("/api/ai/roadmap", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            ...data,
            language: data.language || "en"
        })

    })

}