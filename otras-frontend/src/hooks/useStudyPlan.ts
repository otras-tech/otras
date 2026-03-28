import { useState, useEffect } from "react";
import axios from "axios";

export function useStudyPlan(userId: string) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchPlans();
    }
  }, [userId]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/api/v1/study-plans/user/${userId}`);
      setPlans(res.data);
    } catch (err) {
      console.error("Failed to fetch study plans", err);
    } finally {
      setLoading(false);
    }
  };

  return { plans, loading, refetch: fetchPlans };
}
