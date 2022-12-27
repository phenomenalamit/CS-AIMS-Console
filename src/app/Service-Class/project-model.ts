export class ProjectModel {
    ID_PROJECT !: number;
    PROJECT_TITLE !: string;
    START_DATE !: string;
    ID_PROJECT_SITUATION_MASTER !: number;
    AMT_ALO_NAT_MZN !: number;
    AMT_ALO_NAT_USD !: number;
    TOT_ODA_MZN !: number;
    TOT_ODA_USD !: number;
    END_DATE !: String;
    RESPONSIBLE_ORGANIZATION!:ResponsibleOrganization;
    PROJECT_IMPLEMENTING_ORG : ProjectImplOrg[] = [];
    PROJECT_ODA_ALLOCATION : ProjectOdaAllocation[] = [];
    PROJECT_SUSTAINABLE_DEV_GOAL : ProjectSustainableDevelopementGoal[] = [];
    PROJECT_SUSTAINABLE_DEV_TARGET : ProjectSustainableDevelopementTarget[] = [];
    PROJECT_FINANCIAL_AGREEMENT : ProjectFinancialAgreement[] = [];
    PROJECT_MARKER : ProjectMarker[] = [];
}

export class ProjectImplOrg{
    ID_PROJECT_IMPLEMENTING_ORG !: number;
    ID_ORGANIZATION !: number;
    COUNTRY_PARENT_ORGANIZATION !: string;
    NAME !: string;
    ACRONYM !: string;
}

export class ProjectOdaAllocation{
    ID_PROJECT_ODA_ALLOCATION !: number;
    ID_SECTOR_DAC_CRS_5DIGIT_MSTR !: number;
    AMOUNT_ALO_MZN !: number;
    AMOUNT_ALO_USD !: number;
    AMOUNT_DES_MZN !: number;
    AMOUNT_DES_USD !: number;
}

export class ProjectSustainableDevelopementGoal{
    ID_PROJECT_SDG !: number;
    ID_SUSTAINABLE_DEV_GOAL_MASTER !: number;
}

export class ProjectSustainableDevelopementTarget{
    ID_PROJECT_SDT !: number;
    ID_SUSTAINABLE_DEV_TARGET_MSTR !: number;
}

export class ProjectFinancialAgreement{
    ID_PROJECT_FINANCIAL_AGREEMENT !: number;
    ID_FINANCIAL_AGREEMENT !: number;
    FINANCIAL_AGREEMENT !: FinancialAgreementObj;
}

export class FinancialAgreementObj{
    FUNDING_DONOR_TITLE !: string;
    ID_FINANCING_SITUATION_MASTER !: number;
    ID_COOPERATION_MODALITIES !: number;
    FUNDING_ORGANIZATION !: FundingOrganization;
    RESPONSIBLE_ORGANIZATION !: ResponsibleOrganization;
    START_DATE !: String;
    END_DATE !: string;
    ID_TYPE_OF_IMPLEMENTATN_MASTER !: number;
    ID_STATE_BUDGET_MASTER !: number;
    ID_PILLAR_PQG_MASTER !: number;
    ID_STRATEGIC_OBJCTV_PQG_MASTER !: number;
    ID_DIRECT_IMPLEMENTATN_MASTER !: number;
    ALLOCATED_AMOUNT !: number;
    AMT_ALLOCATED_IN_FA_MZN !: number;
    AMT_ALLOCATED_IN_FA_USD !: number;
    AMT_ALLOCATED_IN_FA_GE_MZN !: number;
    AMT_ALLOCATED_IN_FA_GE_USD !: number;
    ID_TYPE_OF_FINANCE_MASTER !: number;
    FINANCIAL_AGREEMENT_PROVINCE : FinancialAgreementProvince[] = [];
    FINANCIAL_AGREEMENT_DISTRICT : FinancialAgreementDistrict[] = [];
}

export class FundingOrganization{
    ID_ORGANIZATION !: number;
    COUNTRY_PARENT_ORGANIZATION !: string;
    NAME !: string;
    ACRONYM !: string;
}

export class ResponsibleOrganization{
    ID_ORGANIZATION !: number;
    COUNTRY_PARENT_ORGANIZATION !: string;
    NAME !: string;
    ACRONYM !: string;
}
export class FinancialAgreementProvince{
    ID_FINANCIAL_AGRMENT_PROVINCE !: number;
    ID_PROVINCE_MASTER !: number;
}
export class FinancialAgreementDistrict{
    ID_FINANCIAL_AGRMENT_DISTRICT !: number;
    ID_DISTRICTS_MASTER !: number;
}

export class ProjectMarker{
    ID_PROJECT_MRK !: number;
    ID_MARKER !: number;
    MARKER_OPTN !: number;
}
