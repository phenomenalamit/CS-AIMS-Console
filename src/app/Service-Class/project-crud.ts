export class ProjectCrud {
    projectId:number;
    saveAsDraftId:number;
    projectTitle:string;
    eSnipId:string;
    eSnipProjectTitle:string;
    projectSituation:string;
    projectOverview:string;
    startDate:Date;
    endDate:Date;
    responsibleOrganization:string;
    implementingOrganization:string[];
    regional:string;
    projectLink:string;
    sustainableDevelopmentGoals:string[];
    sustainableDevelopmentTarget:string[];
    markerTableData:MarkerTableData[];
    tableDataManager:TableIndividualOrganizaton[];
    selectListOfAssociatedFunding:string[];
    tableComments:TableComments[];
    commentedBy:string;
    commentDate:string;
    projectOdaAllo:OdaAllocation[];
    amtAlloNatPartMZN:number;
	amtAlloNatPartUSD:number;
	totOdaAmtAlloMZN:number;
	totOdaAmtAlloUSD:number;
    totalAmountMzn:number;
    totalAmountUsd:number;
    financialExecutionAmount:number;
	financialExecutionRate:number;
    fetchProjectSituation:any;
    fetchResponsibleOrganizationBean:any;
    projectImplOrgBean:ProjectImplOrgBean[];
    projectSustainableDevelopementGoalBean:any[];
    sustainableDevelopementTargetBean:any[];
    projectFinancialAgreementBean:any[];
    confidentialProject:string;
    projectSituationPt:string;
    idProject:number
    province:string;
    district:string;
    language:string;
    individualEmails:string[];
    emailChk:boolean;
    createFinanceForMozigs:string;
}

export class TableComments{
    comments: String;
    commentedBy;
    commentedOn;
}

export class MarkerTableData{
    markerId:number;
    markerOptions:number;
}

export class TableIndividualOrganizaton{
    orgName:number;
    managers:number;
    startDate:Date;
    endDate:Date;
    post:string;
}

export class OdaAllocation{
    purposeDACCRS:number;
    currency:number;
    funds:number;
}

export class ProjectImplOrgBean{
    idProjImplOrg:number;
    idOrganization:number;
    idProject:number;
    implementingOrganization:ImplementingOrganizationBean;
}

export class ImplementingOrganizationBean{
    implementingOrganizationId:string;
    implementingOrganizationName:string;
    status:string;
}
