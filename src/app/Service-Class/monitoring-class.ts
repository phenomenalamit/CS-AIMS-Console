export class MonitoringClass {
    recommendationId:string;
    recommendationNameEn:string;
    recommendationNamePt:string;
    status:string;

    //Name for findings
    finding_Id:string;
    findingNameEn:string;
    findingNamePt:string;
    
    //Option for findings
    optionFindingId:string;
    optionFindingNameEn:string;
    optionFindingNamePt:string;
    findingId!:number;

    //levelOfAction
    levelOfActionId:number;
    levelOfActionNameEn:string;
    levelOfActionNamePt:string;

    //constraint
    constraintId:number;
    constraintNameEn:string;
    constraintNamePt:string;

    //reason for addendum
    reasonForAddendumId:number;
    reasonForAddendumNameEn:string;
    reasonForAddendumNamePt:string;
    
    createdOn:Date;
    updatedOn:Date;
    difference:number;
    updateDifference:number;
}
