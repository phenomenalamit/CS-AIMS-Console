import { MonitoringConstraintServiceClass } from "./monitoring-constraint-service-class";
import { MonitoringReasonAddendumClass } from "./monitoring-reason-addendum-class";

export class MonitoringContrctServiceClass {
    monitoringContractId:number;
    monitoringFieldVisitId:number;
	nameOfContractedCompany:string;
	contractVAlueMZN:string;
	organizationId:number;
	didContractAddendum:string;
    otherReasonAddendum:string;
    addendumVAlueMZN:string;
	originalContractEndDate:Date;
    endDateAfterAddendum:Date;
	financialExecution:string;
	financialExeRate:string;
	physicalExeRate:string;
    comments:string;
	findings:number;
	selectOptionForFindings:number;
	otherReason:string;
	recommendation:number;
	district:number
	reasonAddendum:MonitoringReasonAddendumClass[];
	constraint:MonitoringConstraintServiceClass[];
	status:string;
	reasonForAddendumAllData:MonitoringReasonAddendumClass[];
}
