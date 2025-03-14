import { City, Institution, MaritalStatus } from "./data-master";
import { BeneficiaryType, Gender } from "./enum";

export interface Demographic {
    id: number;
    fullName: string;
    idNumber: string;
    beneficiary: BeneficiaryType;
    birthDate: any;
    gender: Gender;
    maritalStatus: MaritalStatus;
    spouseName: string;
    city: City;
    address: string;
    employmentHistory: Institution;
    phoneNumber: string;
    guarantee: Guarantee;
}

export interface DemographicPage {
    id: number;
    fullName: string;
    idNumber: string;
    beneficiary: BeneficiaryType;
    birthDate: any;
    gender: Gender;
    maritalStatusName: string;
    spouseName: string;
    cityName: string;
    address: string;
    employmentHistoryName: string;
    phoneNumber: string;
}

export interface DemographicExcel {
    id: number;
    fullName: string;
    idNumber: string;
    beneficiary: BeneficiaryType | string;
    birthDate: string;
    gender: Gender | string;
    maritalStatus: MaritalStatus;
    spouseName: string;
    city: City;
    address: string;
    employmentHistory: Institution;
    phoneNumber: string;
    valid: boolean;
    guarantee: Guarantee;
}

export interface Guarantee {
    fullName: string;
    electoralNumber: string;
    birthDate: string;
    city: City;
    employmentHistory: Institution;
}