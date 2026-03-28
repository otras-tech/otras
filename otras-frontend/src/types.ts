export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  credits: number;
  avatarUrl?: string;
  otrId?: string;
}

export interface DashboardStats {
  readinessIndex: number;
  testsCompleted: number;
  recentTrend: number[];
  percentile: number;
  logicalScore: number;
  quantScore: number;
  verbalScore: number;
}

export interface RoadmapTask {
  day: string;
  date: string;
  activities: Array<{ id: string; timeSlot: string; description: string; completed: boolean; missed?: boolean }>;
}

export interface Roadmap {
  summary: string;
  targetExam: string;
  recommendations: string[];
  sixMonth: Array<{ month: string; tasks: string[] }>;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    statusCode: number;
}
