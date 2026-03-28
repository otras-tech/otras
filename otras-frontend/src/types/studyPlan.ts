export interface Activity {
  id: string;
  timeSlot: string;
  description: string;
  completed: boolean;
  missed?: boolean;
}

export interface DayPlan {
  day: string;
  date: string;
  activities: Activity[];
}

export interface StudyPlan {
  id: string;
  userId: string;
  examId: string;
  durationInDays: number;
  startDate: string;
  days: DayPlan[];
  createdAt: string;
  updatedAt: string;
}
