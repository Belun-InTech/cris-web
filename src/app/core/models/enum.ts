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
    MARITAL_STATUS = 'maritalStatus'
}

export enum DataMasterTitle {
    FINANCIAL_INSTITUTIONS = 'Financial Institutions',
    SECTORS = 'Sectors',
    CREDIT_CLASSIFICATIONS = 'Credit Classifications',
    CITIES = 'Cities',
    INSTITUTIONS = 'Institutions',
    MARITAL_STATUS = 'Marital Status'
}

export enum EntityType {
    person = 'Person',
    business = 'Business'
}