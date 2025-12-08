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
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  instructorId?: string;
  studentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBatchRequest {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

