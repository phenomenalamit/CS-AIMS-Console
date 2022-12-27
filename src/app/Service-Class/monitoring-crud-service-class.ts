import { MonitoringConstraintServiceClass } from "./monitoring-constraint-service-class";
import { MonitoringFieldVisitsServiceClass } from "./monitoring-field-visits-service-class";
import { MonitoringPhysicalExeServiceClass } from "./monitoring-physical-exe-service-class";
import { MonitoringReasonAddendumClass } from "./monitoring-reason-addendum-class";

export class MonitoringCrudServiceClass {
    monitoringId:number;
    projectId:number;
    levelOfAction:number;
    conditionOfDisbursment:string;
    usergroup:string;
    createdOn:string;
    saveAsDraftId:string;
    startDt:Date;
    endDt:Date;
    fieldVisitId:number;
    /* Physical Execution data start */
    monitoringPhyExeData:string;
    monitoringPhysicalExeData:MonitoringPhysicalExeServiceClass[];
    monitoringPhyAllData:MonitoringPhysicalExeServiceClass[];
    monitoringPhysicalId:number;
    dateOfFinancialExecution:Date;
    financialExeRate:number;
    physicalExeRate:number;
    /* Physical Execution data end */

    /* Field visit start */
    monitoringFieldVisitData:string;
    monitoringFieldVisitAllData:MonitoringFieldVisitsServiceClass[];
    monitoringFiledVisitId:number;
    provience:number;
    district:number;
    dateOfFieldVisit:Date;
    /* Field Visit End */

    /* Contract start */
    monitoringContractData:string;
    monitoringContractId:number;
    monitoringFieldVisitId:number;
	nameOfContractedCompany:string;
	contractVAlueMZN:number;
	organizationId:number;
	didContractAddendum:string;
    addendumVAlueMZN:number;
	originalContractEndDate:Date;
    endDateAfterAddendum:Date;
	financialExecution:number;

	financialExeRateContract:string;
	physicalExeRateContract:string;

    comments:string;
	findings:number;
	selectOptionForFindings:number;
	otherReasonForAddendum:string;
	recommendation:number;
    otherReason:string;
    constraint:MonitoringConstraintServiceClass[]
    /* Contract End */

    /*Reason for addendum strat */
    monitoringReasonsAddendumData:string;
    monitoringReasonsAddendumId:number;
    reasonForAddendum:MonitoringReasonAddendumClass[];
    /* Reason for addendum end */

    /* View monitoring Start*/
    projectNm:string;
    strategicPriorityPQG:string;
    strategicObjectivePQG:string;
    organization:string;
    startDate:string;
    endDate:string;
    totalBudgetMzn:string;
    levelOfActionn:string;
    province:string;
    districts:string;
    levelOfActionnPt:string;
    /* View monitoring End*/

    language:string
    budgetPrj:string
}
