export type Priority = 'high' | 'medium' | 'low';
export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'paused';
export const TODAY_STR = new Date().toISOString().split('T')[0];

export interface UserProfile {
  name: string;
  role: string;
  targetExam: string;
  targetYear: string;
  dailyStudyTargetHours: number;
  wakeTime: string;
  visionStatement: string;
  avatarUrl: string;
}

export interface VisionGoal {
  id: string;
  title: string;
  horizonYears: string; // e.g. "2026 - 2029 (3 Years)"
  description: string;
  category: 'Career & Academics' | 'Skill Mastery' | 'Health & Personality' | 'Impact';
  targetDate: string;
  progress: number; // 0 - 100
  color: string;
}

export interface YearlyGoal {
  id: string;
  visionId: string;
  year: number; // e.g. 2026
  title: string;
  keyOutcomes: string[];
  targetMetric: string; // e.g. "Complete 100% syllabus + 500 Mock tests"
  status: GoalStatus;
  progress: number; // 0 - 100
}

export interface MonthlyMilestone {
  id: string;
  yearlyGoalId: string;
  year: number;
  month: number; // 1 - 12
  monthName: string; // e.g. "November 2026"
  title: string;
  focusArea: string;
  status: GoalStatus;
  progress: number; // 0 - 100
}

export interface WeeklySprint {
  id: string;
  monthlyMilestoneId: string;
  weekNumber: number; // 1 - 52
  startDate: string;
  endDate: string;
  title: string;
  targetStudyHours: number;
  completedStudyHours: number;
  status: GoalStatus;
  progress: number; // 0 - 100
}

export interface DailyTask {
  id: string;
  sprintId?: string;
  title: string;
  subject: string;
  priority: Priority;
  estimatedMins: number;
  completedMins: number;
  completed: boolean;
  date: string; // YYYY-MM-DD
  dueDate?: string;
}

export interface Habit {
  id: string;
  title: string;
  category: 'discipline' | 'study' | 'health' | 'mindset';
  icon: string;
  targetFrequency: 'daily' | 'weekdays';
  currentStreak: number;
  bestStreak: number;
  // History mapped by YYYY-MM-DD
  history: Record<string, boolean>;
  reminderTime?: string;
}

export interface StudySession {
  id: string;
  subject: string;
  topic: string;
  durationMins: number;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
  notes?: string;
  mood?: 'focused' | 'moderate' | 'distracted';
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  studyMinutes: number;
  studyTargetMinutes: number;
  habitsCompleted: number;
  habitsTotal: number;
  tasksCompleted: number;
  tasksTotal: number;
  reflectionWin: string;
  reflectionImprovement: string;
  tomorrowPriorities: string[];
  energyRating: number; // 1 to 5
  grade: 'A+' | 'A' | 'B+' | 'B' | 'Needs Focus';
  quote: string;
  savedAt: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string; // HH:mm
  type: 'morning' | 'study' | 'habit' | 'evening' | 'custom';
  active: boolean;
  days: number[]; // 0 = Sun, 1 = Mon ... 6 = Sat
  soundEnabled: boolean;
}

export interface MotivationQuote {
  id: string;
  quote: string;
  hindiText: string;
  author: string;
  category: 'Discipline' | 'Hard Work' | 'Focus' | 'Vision' | 'Grit';
}
