import { FinancialInstitution } from "./data-master";
import { Role } from "./role";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    isDisabled: boolean;
    password: string;
    jwtSession: string;
    role: Role;
    financialInstitution: FinancialInstitution
    internal: boolean;
}