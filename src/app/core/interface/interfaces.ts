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
