import { Timestamp } from "rxjs/internal/operators/timestamp";
import { EnvelopeTableData } from "./envelope-table-data";

export class EnvelopeServiceClass {
    envelopeId:string;
    fundingOrganization:string;
    currencyMaster:number;
    purposeDacCrs:string;
    comments:string;
    status:string;
    envelopeReference:string;
    email:string[]
    emailChk:boolean

    envelopTableData:string;
    envelopeAllTableData:EnvelopeTableData[];

    timeStamp:string;
    //added

    envelopeTableId:number;
    
    currency:string;
    usdAmount:string;
    year:string;
    endYear:string;
    amount:string;
    tableStatus:string;
    saveAsDraftId:string;
    usergroup:string;
    fundingOrg:string;
    currencyList: any;
    purposeDacCrsPt:string;
    totalEnvelopeAmountMzn:number;
    totalEnvelopeAmountUsd:number;
    totalUnfundedAmountMzn:number;
    totalUnfundedAmountUsd:number;
    totalUnprogrammedFunds:number;
    totalProgrammedFunds:number;
    acronym:string;
    language:string;
    records:string[];
}
