export interface signConfig {
    username:string,
    password:string

}
export interface registerConfig {
    username:string,
    email:string,
    password:string,
    role: 'STUDENT' | 'INSTRUCTOR' | 'USER',
}
export interface otpConfig{
    email:string,
    otp?:string,
    username?:string
}

export interface UserInfo {
    username: string;
    role: string;
    enabled?: boolean;
  }
  export interface Instructor {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  specialties?: string[]; // subjects/tags
  avatarUrl?: string;
  verified?: boolean;
  approved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Batch {
  id?: string;
  batchName: string;
  description?: string;
  batchCode?: string; // Join code for students
  startDate?: string;
  endDate?: string;
  instructorId?: string;
  studentCount?: number;
  quizCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBatchRequest {
  batchName: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface Quiz {
  id?: string;
  title: string;
  description?: string;
  subject?: string;
  timerInMin: number; // in minutes
  totalMarks?: number;
  passingMarks?: number;
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  instructorId?: string;
  batchId?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  questionCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface NavItem {
  label: string;
  routerLink: string;
  icon: string;
}

export interface CreateQuizRequest {
  title: string;
  description?: string;
  subject?: string;
  timerInMin?: number;
  totalMarks?: number;
  passingMarks?: number;
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  batchId?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
}

export interface Question {
  id?: string;
  quizId?: string;
  questionTitle?: string;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  rightAnswer: string | string[]; // Can be single or multiple answers
  marks: number;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuestionRequest {
  quizId: string | number;
  questionTitle: string;
  // questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  rightAnswer: string;
  marks: number;
  order?: number;
}

export interface Student {
  id?: string;
  userId?: string;
  username?:string;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  enrolledBatches?: string[]; // Batch IDs
  batchNames?: string[]; // Batch names for display
  quizzesCompleted?: number;
  averageScore?: number;
  lastActive?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizAttempt {
  id?: string;
  quizId: string;
  studentId?: string;
  startedAt?: string;
  submittedAt?: string;
  responses?: QuizResponse[];
  score?: number;
  totalMarks?: number;
  percentage?: number;
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'SUBMITTED';
}

export interface QuizResponse {
  id: string;
  response: string | string[];
}

export interface SubmitQuizRequest {
  responses: QuizResponse[];
}

export interface QuizResults {
  id?: string;
  quizId: string;
  quizTitle?: string;
  studentId?: string;
  score: number;
  totalMarks: number;
  percentage: number;
  startedAt?: string;
  submittedAt?: string;
  passed?: boolean;
  responses?: QuizResponse[];
  timeTaken?: number; // in seconds
  questionReviews?: QuestionReview[];
}

export interface QuestionReview {
  questionId: string;
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
  // options?: string[]; // Commented out - using option1, option2, option3, option4 instead
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  correctAnswer: string | string[];
  selectedAnswer: string | string[];
  correct: boolean;
  marks: number;
  earnedMarks: number;
  order?: number;
}

export interface StudentResult {
  studentId: string;
  studentName: string;
  studentEmail?: string;
  score: number;
  totalMarks: number;
  percentage: number;
  timeTaken?: number; // in seconds
  submittedAt?: string;
  startedAt?: string;
  passed?: boolean;
  rank?: number;
}

export interface BatchResult {
  batchId: string;
  batchName: string;
  quizId: string;
  quizTitle: string;
  totalStudents: number;
  studentsCompleted: number;
  averageScore?: number;
  averagePercentage?: number;
  studentResults: StudentResult[];
}

export interface QuestionWrapper {
  id: string;
  questionTitle: string;
  // questionType?: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  rightAnswer: string;
  marks: number;
  order?: number;
  // Note: correctAnswer is NOT included in QuestionWrapper for students
}

