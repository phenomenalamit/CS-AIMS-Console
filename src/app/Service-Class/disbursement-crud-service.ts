export class DisbursementCrudService {
    disbursement_id!:any;
    projectTitle:any;
    projectTitleId:string;
    // fundingTitle:any;
    // fundingTitleId:string;
    // fundingOrganizationId:string;
    // fundingOrganization:any;
    date:any;
    swiftcode:any;
    receivedswiftcode:any;
    receivedBankNIB:any;
    amount:any;
    currency:any;
    exchangeRateMZN:any;
    exchangeRateUSD:any;
    disbursementAmountMZN:any;
    disbursementAmountUSD:any;
    vchstatus:any;
    disbursementReference!:any;
    timeStamp:string;
    saveAsDraftId!:any;
    currency_id!:any;
    currencyId!:number;

    financialAgreementId:number;
    fundingDonorTitle:any;
    idProject!:number;
    id!:number;
    names!:any;
    fundingDonor!:string; //for project module
    fundingReference!:string //for project module
    individualEmails!:string[];
    emailChk:boolean;
    records:string[];
}
