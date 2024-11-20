export interface User {
    id: number;
    fullName: string;
    username: string;
    email: string;
    confirmed: boolean;
    blocked: boolean;
    password: string;
}