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
  }
