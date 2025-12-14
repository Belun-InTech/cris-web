export enum Account {
    internal = 'internal',
    external = 'external'
}

export enum Gender {
    male = 'male',
    female = 'female'
}

export enum Role {
    admin = 'ROLE_ADMIN',
    staff = 'ROLE_STAFF',
    client = 'ROLE_CLIENT'
}

export enum Permission {
    MENU_DASHBOARD_ACCESS = 'MENU_DASHBOARD_ACCESS',
    MENU_DEMOGRAPHIC_SEARCH = 'MENU_DEMOGRAPHIC_SEARCH',
    MENU_DEMOGRAPHIC_NEW = 'MENU_DEMOGRAPHIC_NEW',
    MENU_CREDIT_NEW = 'MENU_CREDIT_NEW',
    MENU_USERS_MANAGE = 'MENU_USERS_MANAGE',
    MENU_DATA_MASTER_MANAGE = 'MENU_DATA_MASTER_MANAGE',
    MENU_AUDIT_LOGS_ACCESS = 'MENU_AUDIT_LOGS_ACCESS',
}

export enum Status {
    active = 'active',
    pending = 'pending',
    disabled = 'disabled'
}

export enum DataMaster {
    FINANCIAL_INSTITUTIONS = 'financialInstitutions',
    SECTORS = 'sectors',
    CREDIT_CLASSIFICATIONS = 'creditClassifications',
    CITIES = 'cities',
    INSTITUTIONS = 'institutions',
    MARITAL_STATUS = 'maritalStatus',
    MANNER_OF_PAYMENT = 'manners',
}

export enum DataMasterTitle {
    FINANCIAL_INSTITUTIONS = 'Financial Institutions',
    SECTORS = 'Sectors',
    CREDIT_CLASSIFICATIONS = 'Credit Classifications',
    CITIES = 'Cities',
    INSTITUTIONS = 'Institutions',
    MARITAL_STATUS = 'Marital Status',
    MANNER_OF_PAYMENT = 'Manners of Payment',
}

export enum BeneficiaryType {
    individual = 'Individual',
    company = 'Company'
}

export enum MathOperator {
    greater = '>',
    less = '<',
    equal = '=',
}