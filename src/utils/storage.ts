import {
  UserProfile,
  VisionGoal,
  YearlyGoal,
  MonthlyMilestone,
  WeeklySprint,
  DailyTask,
  Habit,
  StudySession,
  DailySummary,
  ReminderItem,
  MotivationQuote,
} from '../types';

export const TODAY_STR = new Date().toISOString().split('T')[0];

export const INITIAL_USER: UserProfile = {
  name: 'Vivek Yadav',
  role: 'Student & Future Tech Leader',
  targetExam: 'Academic Excellence & Engineering Mastery (GATE / Placements)',
  targetYear: '2026 - 2029',
  dailyStudyTargetHours: 6,
  wakeTime: '06:00 AM',
  visionStatement: 'Master core concepts, build unbreakable daily discipline, crack top milestones, and make family proud.',
  avatarUrl: '/src/assets/images/vivek_student_avatar_1793054681637.jpg',
};

export const INITIAL_VISION_GOALS: VisionGoal[] = [
  {
    id: 'vision-1',
    title: 'Top-Tier Academic Honors & Dream Software Career',
    horizonYears: '2026 - 2029 (3-Year Vision)',
    description: 'Build world-class mastery in Computer Science, achieve CGPA > 9.0, crack top competitive exams and high-impact engineering roles.',
    category: 'Career & Academics',
    targetDate: '2029-06-30',
    progress: 42,
    color: '#4F46E5', // indigo
  },
  {
    id: 'vision-2',
    title: 'Mental Grit, Physical Stamina & High Performance Routine',
    horizonYears: '2026 - 2028 (2-Year Vision)',
    description: 'Develop supreme physical health, 6:00 AM consistency, continuous reading habit, and unshakable student focus.',
    category: 'Health & Personality',
    targetDate: '2028-12-31',
    progress: 58,
    color: '#0D9488', // teal
  },
  {
    id: 'vision-3',
    title: 'Advanced Skill Stack: AI Systems & Competitive Coding',
    horizonYears: '2026 - 2027 (18-Month Vision)',
    description: 'Master Data Structures & Algorithms, Full Stack Architecture, Cloud systems, and participate in national hackathons.',
    category: 'Skill Mastery',
    targetDate: '2027-12-31',
    progress: 35,
    color: '#D97706', // amber
  },
];

export const INITIAL_YEARLY_GOALS: YearlyGoal[] = [
  {
    id: 'year-2026',
    visionId: 'vision-1',
    year: 2026,
    title: 'Year 1: Foundations & Core Subject Mastery',
    keyOutcomes: [
      'Maintain Semester CGPA >= 9.0',
      'Solve 350+ DSA Problems on LeetCode / GeeksForGeeks',
      'Build 3 Full-Stack End-to-End Projects',
      'Complete Operating Systems, DBMS & Mathematics Core',
    ],
    targetMetric: '100% Core Syllabus + 350 DSA Problems',
    status: 'in_progress',
    progress: 68,
  },
  {
    id: 'year-2027',
    visionId: 'vision-1',
    year: 2027,
    title: 'Year 2: Advanced Specialization & Internships',
    keyOutcomes: [
      'Top 5% in National Coding Contests',
      'Secure Tier-1 Research / Summer Software Internship',
      'Publish Open Source projects and technical research',
    ],
    targetMetric: 'Summer Internship Secured + Advanced System Design',
    status: 'not_started',
    progress: 15,
  },
  {
    id: 'year-2028',
    visionId: 'vision-1',
    year: 2028,
    title: 'Year 3: Dream Placement & Leadership Capstone',
    keyOutcomes: [
      'Crack Top Tier Product Company Placement Offer',
      'Lead Student Technical Team & Mentorship',
    ],
    targetMetric: 'Dream Offer Confirmed',
    status: 'not_started',
    progress: 0,
  },
];

export const INITIAL_MONTHLY_MILESTONES: MonthlyMilestone[] = [
  {
    id: 'month-nov-2026',
    yearlyGoalId: 'year-2026',
    year: 2026,
    month: 11,
    monthName: 'November 2026',
    title: 'Data Structures Sprint: Trees, Graphs & OS Memory Management',
    focusArea: 'Binary Trees, BST, Graphs, Virtual Memory, Paging, Calculus III',
    status: 'in_progress',
    progress: 74,
  },
  {
    id: 'month-dec-2026',
    yearlyGoalId: 'year-2026',
    year: 2026,
    month: 12,
    monthName: 'December 2026',
    title: 'Dynamic Programming, DBMS Indexing & Semester Exam Revisions',
    focusArea: 'DP Patterns, SQL Optimization, Mock Test Series',
    status: 'not_started',
    progress: 0,
  },
];

export const INITIAL_WEEKLY_SPRINTS: WeeklySprint[] = [
  {
    id: 'sprint-w43',
    monthlyMilestoneId: 'month-nov-2026',
    weekNumber: 43,
    startDate: '2026-10-23',
    endDate: '2026-10-29',
    title: 'Sprint: 25 LeetCode Problems, OS Virtual Memory & 36 Study Hours',
    targetStudyHours: 36,
    completedStudyHours: 28.5,
    status: 'in_progress',
    progress: 79,
  },
  {
    id: 'sprint-w44',
    monthlyMilestoneId: 'month-nov-2026',
    weekNumber: 44,
    startDate: '2026-10-30',
    endDate: '2026-11-05',
    title: 'Sprint: Graph Traversals (BFS/DFS), DBMS Transactions & Mock Paper',
    targetStudyHours: 36,
    completedStudyHours: 0,
    status: 'not_started',
    progress: 0,
  },
];

export const INITIAL_DAILY_TASKS: DailyTask[] = [
  {
    id: 'task-1',
    sprintId: 'sprint-w43',
    title: 'Solve 3 LeetCode problems on Binary Search Trees (LCA, Inorder traversal)',
    subject: 'Data Structures',
    priority: 'high',
    estimatedMins: 90,
    completedMins: 90,
    completed: true,
    date: TODAY_STR,
  },
  {
    id: 'task-2',
    sprintId: 'sprint-w43',
    title: 'Complete Operating Systems: Virtual Memory & Page Replacement Algorithms',
    subject: 'Operating Systems',
    priority: 'high',
    estimatedMins: 120,
    completedMins: 110,
    completed: true,
    date: TODAY_STR,
  },
  {
    id: 'task-3',
    sprintId: 'sprint-w43',
    title: 'Engineering Mathematics: Solve 15 practice problems on Differential Equations',
    subject: 'Mathematics',
    priority: 'medium',
    estimatedMins: 75,
    completedMins: 75,
    completed: true,
    date: TODAY_STR,
  },
  {
    id: 'task-4',
    sprintId: 'sprint-w43',
    title: 'Active Spaced Repetition Revision: Computer Networks OSI Model & Protocols',
    subject: 'Computer Networks',
    priority: 'medium',
    estimatedMins: 45,
    completedMins: 0,
    completed: false,
    date: TODAY_STR,
  },
  {
    id: 'task-5',
    sprintId: 'sprint-w43',
    title: 'Evening Code Sprint: Build API endpoints for Student Management Module',
    subject: 'Web Development',
    priority: 'low',
    estimatedMins: 60,
    completedMins: 0,
    completed: false,
    date: TODAY_STR,
  },
];

// Helper to generate past dates
function getPastDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

// Generate realistic habit history for last 30 days
function generateHabitHistory(rate: number): Record<string, boolean> {
  const history: Record<string, boolean> = {};
  for (let i = 0; i <= 35; i++) {
    const dateStr = getPastDateStr(i);
    // Recent days higher completion
    const chance = i < 7 ? rate + 0.1 : rate;
    history[dateStr] = Math.random() < chance;
  }
  history[TODAY_STR] = true; // Today checked
  return history;
}

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'Early Morning Rise (06:00 AM)',
    category: 'discipline',
    icon: 'Sun',
    targetFrequency: 'daily',
    currentStreak: 14,
    bestStreak: 28,
    history: generateHabitHistory(0.85),
    reminderTime: '06:00',
  },
  {
    id: 'habit-2',
    title: 'Daily Deep Study (Min 5-6 Hours)',
    category: 'study',
    icon: 'BookOpen',
    targetFrequency: 'daily',
    currentStreak: 12,
    bestStreak: 21,
    history: generateHabitHistory(0.80),
    reminderTime: '09:00',
  },
  {
    id: 'habit-3',
    title: 'Daily Coding / Problem Solving (2+ Problems)',
    category: 'study',
    icon: 'Code',
    targetFrequency: 'daily',
    currentStreak: 18,
    bestStreak: 30,
    history: generateHabitHistory(0.90),
    reminderTime: '15:00',
  },
  {
    id: 'habit-4',
    title: 'Physical Workout / Running / Yoga (30m)',
    category: 'health',
    icon: 'Activity',
    targetFrequency: 'daily',
    currentStreak: 8,
    bestStreak: 15,
    history: generateHabitHistory(0.75),
    reminderTime: '18:00',
  },
  {
    id: 'habit-5',
    title: 'Active Revision & Spaced Recall (45m)',
    category: 'study',
    icon: 'Brain',
    targetFrequency: 'daily',
    currentStreak: 9,
    bestStreak: 14,
    history: generateHabitHistory(0.70),
    reminderTime: '20:30',
  },
  {
    id: 'habit-6',
    title: 'Night Reflection & Daily Summary Log',
    category: 'mindset',
    icon: 'CheckSquare',
    targetFrequency: 'daily',
    currentStreak: 14,
    bestStreak: 20,
    history: generateHabitHistory(0.88),
    reminderTime: '21:45',
  },
];

export const INITIAL_STUDY_SESSIONS: StudySession[] = [
  {
    id: 'session-1',
    subject: 'Data Structures',
    topic: 'Binary Search Tree traversals, LCA & height balancing',
    durationMins: 90,
    date: TODAY_STR,
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    notes: 'Understood recursive vs iterative approach. Solved 3 medium problems.',
    mood: 'focused',
  },
  {
    id: 'session-2',
    subject: 'Operating Systems',
    topic: 'Virtual Memory, TLB hit/miss & Page Replacement algorithms (LRU, FIFO)',
    durationMins: 110,
    date: TODAY_STR,
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    notes: 'Made concise formula sheet on effective access time.',
    mood: 'focused',
  },
  {
    id: 'session-3',
    subject: 'Mathematics',
    topic: 'Higher Order Differential Equations with Constant Coefficients',
    durationMins: 75,
    date: TODAY_STR,
    timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    notes: 'Practiced 15 university level previous year questions.',
    mood: 'focused',
  },
  // Past days sessions for graphs
  {
    id: 'session-p1',
    subject: 'Data Structures',
    topic: 'Heap Sort & Priority Queues',
    durationMins: 120,
    date: getPastDateStr(1),
    timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    mood: 'focused',
  },
  {
    id: 'session-p2',
    subject: 'Operating Systems',
    topic: 'Process Synchronization & Semaphores',
    durationMins: 150,
    date: getPastDateStr(1),
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    mood: 'focused',
  },
  {
    id: 'session-p3',
    subject: 'Mathematics',
    topic: 'Eigenvalues and Diagonalization',
    durationMins: 90,
    date: getPastDateStr(2),
    timestamp: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
    mood: 'focused',
  },
  {
    id: 'session-p4',
    subject: 'Computer Networks',
    topic: 'TCP Handshake & Sliding Window Protocol',
    durationMins: 135,
    date: getPastDateStr(2),
    timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    mood: 'focused',
  },
  {
    id: 'session-p5',
    subject: 'Data Structures',
    topic: 'Trie Data Structure & Autocomplete logic',
    durationMins: 160,
    date: getPastDateStr(3),
    timestamp: new Date(Date.now() - 76 * 3600 * 1000).toISOString(),
    mood: 'focused',
  },
  {
    id: 'session-p6',
    subject: 'Web Development',
    topic: 'State management and REST APIs',
    durationMins: 120,
    date: getPastDateStr(4),
    timestamp: new Date(Date.now() - 100 * 3600 * 1000).toISOString(),
    mood: 'focused',
  },
  {
    id: 'session-p7',
    subject: 'Operating Systems',
    topic: 'Deadlock detection & Bankers Algorithm',
    durationMins: 140,
    date: getPastDateStr(5),
    timestamp: new Date(Date.now() - 124 * 3600 * 1000).toISOString(),
    mood: 'focused',
  },
  {
    id: 'session-p8',
    subject: 'Data Structures',
    topic: 'Graph BFS and Topological Sorting',
    durationMins: 180,
    date: getPastDateStr(6),
    timestamp: new Date(Date.now() - 148 * 3600 * 1000).toISOString(),
    mood: 'focused',
  },
];

export const INITIAL_DAILY_SUMMARIES: DailySummary[] = [
  {
    date: getPastDateStr(1),
    studyMinutes: 270,
    studyTargetMinutes: 360,
    habitsCompleted: 5,
    habitsTotal: 6,
    tasksCompleted: 4,
    tasksTotal: 5,
    reflectionWin: 'Completed Semaphores and Deadlocks revision without touching phone for 3 hours!',
    reflectionImprovement: 'Need to wake up strictly at 6:00 AM instead of snoozing 20 minutes.',
    tomorrowPriorities: ['Binary Trees deep dive', 'OS Virtual memory notes', '15 differential equation sums'],
    energyRating: 5,
    grade: 'A',
    quote: 'Utho, jago aur tab tak mat ruko jab tak lakshya prapt na ho jaye. - Swami Vivekananda',
    savedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    date: getPastDateStr(2),
    studyMinutes: 225,
    studyTargetMinutes: 360,
    habitsCompleted: 5,
    habitsTotal: 6,
    tasksCompleted: 4,
    tasksTotal: 4,
    reflectionWin: 'Solved complex eigenvalue questions correctly on first attempt.',
    reflectionImprovement: 'Spent 40 minutes wandering on YouTube shorts during lunch. Must keep phone in drawer.',
    tomorrowPriorities: ['TCP handshake practice', 'Operating systems deadlock problems'],
    energyRating: 4,
    grade: 'B+',
    quote: 'Sapne wo nahi jo hum sote hue dekhte hain, sapne wo hain jo hume sone nahi dete. - Dr. APJ Abdul Kalam',
    savedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    title: '☀️ Morning Alarm & Today\'s Sankalp Review',
    time: '06:00',
    type: 'morning',
    active: true,
    days: [0, 1, 2, 3, 4, 5, 6],
    soundEnabled: true,
  },
  {
    id: 'rem-2',
    title: '📖 Morning Deep Study Slot (Block 1)',
    time: '09:00',
    type: 'study',
    active: true,
    days: [1, 2, 3, 4, 5, 6],
    soundEnabled: true,
  },
  {
    id: 'rem-3',
    title: '💻 Problem Solving & Coding Sprint',
    time: '15:00',
    type: 'study',
    active: true,
    days: [1, 2, 3, 4, 5, 6],
    soundEnabled: true,
  },
  {
    id: 'rem-4',
    title: '🏃 Physical Workout & Outdoor Run',
    time: '18:00',
    type: 'habit',
    active: true,
    days: [0, 1, 2, 3, 4, 5, 6],
    soundEnabled: true,
  },
  {
    id: 'rem-5',
    title: '🌙 Night Daily Summary & Next Day Planning',
    time: '21:30',
    type: 'evening',
    active: true,
    days: [0, 1, 2, 3, 4, 5, 6],
    soundEnabled: true,
  },
];

export const MOTIVATION_QUOTES: MotivationQuote[] = [
  {
    id: 'quote-1',
    quote: 'Arise, awake, and stop not till the goal is reached.',
    hindiText: 'उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।',
    author: 'Swami Vivekananda',
    category: 'Grit',
  },
  {
    id: 'quote-2',
    quote: 'Dreams are not what you see in your sleep, dreams are things which do not let you sleep.',
    hindiText: 'सपने वो नहीं जो हम सोते हुए देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।',
    author: 'Dr. APJ Abdul Kalam',
    category: 'Vision',
  },
  {
    id: 'quote-3',
    quote: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of actions.',
    hindiText: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    author: 'Bhagavad Gita 2.47',
    category: 'Focus',
  },
  {
    id: 'quote-4',
    quote: 'They may kill me, but they cannot kill my ideas. They can crush my body, but they will not be able to crush my spirit.',
    hindiText: 'वे मुझे मार सकते हैं, लेकिन मेरे विचारों को नहीं मार सकते। वे मेरे शरीर को कुचल सकते हैं, पर मेरे हौसले को नहीं।',
    author: 'Shaheed Bhagat Singh',
    category: 'Grit',
  },
  {
    id: 'quote-5',
    quote: 'We don’t rise to the level of our expectations, we fall to the level of our training and daily habits.',
    hindiText: 'हम अपनी उम्मीदों के स्तर तक नहीं पहुंचते, बल्कि अपने दैनिक अभ्यास और अनुशासन के स्तर पर टिकते हैं।',
    author: 'Archilochus',
    category: 'Discipline',
  },
  {
    id: 'quote-6',
    quote: 'Small daily disciplines repeated consistently over time lead to monumental achievements.',
    hindiText: 'हर दिन का छोटा सा अनुशासन, जब लगातार दोहराया जाता है, तो इतिहास रच देता है।',
    author: 'Student Wisdom',
    category: 'Hard Work',
  },
  {
    id: 'quote-7',
    quote: 'The secret of getting ahead is getting started. Break your complex overwhelming tasks into small manageable tasks, and start on the first one.',
    hindiText: 'आगे बढ़ने का सबसे बड़ा रहस्य है शुरुआत करना। बड़े लक्ष्य को छोटे टुकड़ों में बांटो और आज ही शुरू करो।',
    author: 'Mark Twain',
    category: 'Discipline',
  },
];

// LocalStorage Keys
const KEYS = {
  USER: 'lakshya_user_profile',
  VISIONS: 'lakshya_visions',
  YEARLY: 'lakshya_yearly_goals',
  MONTHLY: 'lakshya_monthly_milestones',
  WEEKLY: 'lakshya_weekly_sprints',
  TASKS: 'lakshya_daily_tasks',
  HABITS: 'lakshya_habits',
  SESSIONS: 'lakshya_study_sessions',
  SUMMARIES: 'lakshya_daily_summaries',
  REMINDERS: 'lakshya_reminders',
};

export const storage = {
  getUser: (): UserProfile => {
    const raw = localStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : INITIAL_USER;
  },
  saveUser: (user: UserProfile) => {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  getVisions: (): VisionGoal[] => {
    const raw = localStorage.getItem(KEYS.VISIONS);
    return raw ? JSON.parse(raw) : INITIAL_VISION_GOALS;
  },
  saveVisions: (v: VisionGoal[]) => {
    localStorage.setItem(KEYS.VISIONS, JSON.stringify(v));
  },

  getYearlyGoals: (): YearlyGoal[] => {
    const raw = localStorage.getItem(KEYS.YEARLY);
    return raw ? JSON.parse(raw) : INITIAL_YEARLY_GOALS;
  },
  saveYearlyGoals: (y: YearlyGoal[]) => {
    localStorage.setItem(KEYS.YEARLY, JSON.stringify(y));
  },

  getMonthlyMilestones: (): MonthlyMilestone[] => {
    const raw = localStorage.getItem(KEYS.MONTHLY);
    return raw ? JSON.parse(raw) : INITIAL_MONTHLY_MILESTONES;
  },
  saveMonthlyMilestones: (m: MonthlyMilestone[]) => {
    localStorage.setItem(KEYS.MONTHLY, JSON.stringify(m));
  },

  getWeeklySprints: (): WeeklySprint[] => {
    const raw = localStorage.getItem(KEYS.WEEKLY);
    return raw ? JSON.parse(raw) : INITIAL_WEEKLY_SPRINTS;
  },
  saveWeeklySprints: (w: WeeklySprint[]) => {
    localStorage.setItem(KEYS.WEEKLY, JSON.stringify(w));
  },

  getDailyTasks: (): DailyTask[] => {
    const raw = localStorage.getItem(KEYS.TASKS);
    return raw ? JSON.parse(raw) : INITIAL_DAILY_TASKS;
  },
  saveDailyTasks: (t: DailyTask[]) => {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(t));
  },

  getHabits: (): Habit[] => {
    const raw = localStorage.getItem(KEYS.HABITS);
    return raw ? JSON.parse(raw) : INITIAL_HABITS;
  },
  saveHabits: (h: Habit[]) => {
    localStorage.setItem(KEYS.HABITS, JSON.stringify(h));
  },

  getStudySessions: (): StudySession[] => {
    const raw = localStorage.getItem(KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : INITIAL_STUDY_SESSIONS;
  },
  saveStudySessions: (s: StudySession[]) => {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(s));
  },

  getDailySummaries: (): DailySummary[] => {
    const raw = localStorage.getItem(KEYS.SUMMARIES);
    return raw ? JSON.parse(raw) : INITIAL_DAILY_SUMMARIES;
  },
  saveDailySummaries: (s: DailySummary[]) => {
    localStorage.setItem(KEYS.SUMMARIES, JSON.stringify(s));
  },

  getReminders: (): ReminderItem[] => {
    const raw = localStorage.getItem(KEYS.REMINDERS);
    return raw ? JSON.parse(raw) : INITIAL_REMINDERS;
  },
  saveReminders: (r: ReminderItem[]) => {
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(r));
  },

  // Export all data as JSON
  exportDataJson: (): string => {
    const dump = {
      user: storage.getUser(),
      visions: storage.getVisions(),
      yearly: storage.getYearlyGoals(),
      monthly: storage.getMonthlyMilestones(),
      weekly: storage.getWeeklySprints(),
      tasks: storage.getDailyTasks(),
      habits: storage.getHabits(),
      sessions: storage.getStudySessions(),
      summaries: storage.getDailySummaries(),
      reminders: storage.getReminders(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(dump, null, 2);
  },

  // Import JSON data
  importDataJson: (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.user) storage.saveUser(data.user);
      if (data.visions) storage.saveVisions(data.visions);
      if (data.yearly) storage.saveYearlyGoals(data.yearly);
      if (data.monthly) storage.saveMonthlyMilestones(data.monthly);
      if (data.weekly) storage.saveWeeklySprints(data.weekly);
      if (data.tasks) storage.saveDailyTasks(data.tasks);
      if (data.habits) storage.saveHabits(data.habits);
      if (data.sessions) storage.saveStudySessions(data.sessions);
      if (data.summaries) storage.saveDailySummaries(data.summaries);
      if (data.reminders) storage.saveReminders(data.reminders);
      return true;
    } catch {
      return false;
    }
  },

  // Reset to initial demo data
  resetAll: () => {
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.VISIONS);
    localStorage.removeItem(KEYS.YEARLY);
    localStorage.removeItem(KEYS.MONTHLY);
    localStorage.removeItem(KEYS.WEEKLY);
    localStorage.removeItem(KEYS.TASKS);
    localStorage.removeItem(KEYS.HABITS);
    localStorage.removeItem(KEYS.SESSIONS);
    localStorage.removeItem(KEYS.SUMMARIES);
    localStorage.removeItem(KEYS.REMINDERS);
  },
};
