import { City, CreditClassification, FinancialInstitution, Institution, MannerPayment, MaritalStatus, Sector, TypeCollateral } from "./data-master";
import { BeneficiaryType, Gender, MathOperator } from "./enum";
import { User } from "./user";

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
    credits: Credit[];
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
}

export interface Guarantee {
    fullName: string;
    electoralNumber: string;
    birthDate: string;
    city: City;
    employmentHistory: Institution;
}

export interface Credit {
    id: number;
    idNumber: number;
    demographic: Demographic;
    grantor: FinancialInstitution;
    accountCreationDate: Date;
    dueDate: Date;
    originalBalance: number;
    monthlyPayment: number;
    lastPaymentDate: Date;
    balance: number;
    sector: Sector;
    mannerOfPayment: MannerPayment;
    security: TypeCollateral;
    descriptionSecurity: string;
    assetClass: CreditClassification;
    guarantee: Guarantee;
}

export interface CreditPage {
    id: number;
    idNumber: string;
    grantorName: string;
    dueDate: string;
    monthlyPayment: number;
    lastPaymentDate: string;
    balance: number;
}

export interface CreditExcel {
    id: number;
    idNumber: number;
    grantor: FinancialInstitution;
    accountCreationDate: string;
    dueDate: string;
    originalBalance: number | string;
    monthlyPayment: number | string;
    lastPaymentDate: string;
    balance: number | string;
    sector: Sector;
    mannerOfPayment: MannerPayment;
    security: TypeCollateral;
    descriptionSecurity: string;
    assetClass: CreditClassification;
    valid: boolean;
    guarantee: Guarantee;
}

export interface EmailConfig {
    smtpHost: string;
    smtpPort: number;
    username: string;
    password: string;
    fromEmail: string;
}

export interface LdapConfig {
    url: string;
    baseDn: string
    userDn: string;
    password: string;
    userSearchFilter: string;
}

interface SearchingFee {
    id: number;
    fee: number;
}

export interface Log {
    id: number
    operation: string;
    idNumber: string;
    username: string;
    timestamp: Date;
    financialInstitution: FinancialInstitution;
    user: User;
    searchingFee: SearchingFee;
}

export interface CreditFilter {
    grantorId: number;
    lastPaymentDateFrom: Date;
    lastPaymentDateTo: Date;
    sectorId: number;
    assetClassId: number;
    demographicGender: Gender;
    demographicBeneficiary: BeneficiaryType;
    demographicCityId: number;
    originalBalance: number;
    mathOperator: MathOperator;
    getGuarantee: boolean;
}

export interface DemographicFilter {
    beneficiary: BeneficiaryType;
    financialInstitutionId: number;
    gender: string;
    cityId: number;
}

export interface LogFilter {
    financialInstitutionId: number;
    fromDate: Date | string;
    toDate: Date | string;
}

interface MonthlyCreditCount {
    month: number;
    count: number;
}

interface MonthlyInstitutionBalance {
    month: number;
    financialInstitution: string;
    totalOriginalBalance: number;
}

export interface Dashboard {
    totalDemographic: number;
    totalCredit: number;
    totalFinancialInstitution: number;
    totalDemographicMale: number;
    totalDemographicFemale: number;
    totalDemographicIndividual: number;
    totalDemographicCompany: number;
    totalLoginUsers: number;
    monthlyCreditCountList: MonthlyCreditCount[];
    monthlyInstitutionBalanceList: MonthlyInstitutionBalance[];
}