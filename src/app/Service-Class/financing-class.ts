export class FinancingClass {
    financingSituationId:string;
    financingSituationNameEn:string;
    financingSituationNamePt:string;
    status:string;

    //col name for Type of aid dac crs
    dacCrsId:string;
    dacCrsNameEn:string;
    dacCrsNamePt:string;

    //col for type of implementation
    typeOfImplementationId:string;
    typeOfImplementationName:string;
    typeOfImplementationNamePt:string; 
    

    //col for type of finance
    typeOfFinanceId:string;
    typeOfFinanceName:string;
    typeOfFinanceNamePt:string;

    //col for MeoResourceSource
    meoResourceSourceId:string;
    meoResourceSourceName:string;

    //col for pillar pqg meo
    pillarPqgMeoId:string;
    pillarPqgMeoName:string;
    pillarPqgMeoNamePt:string

    //col for strategic pqg meo
    strategicObjPqgMeoId:string;
    strategicObjPqgMeoName:string;
    strategicObjPqgMeoNamePt:string
    // pillarPqgMeoName:string;

    //State budget
    stateBudgetId:string;
    stateBudget:string;
    stateBudgetPt:string

    createdOn:Date;
    updatedOn:Date;
    difference:number;
    updateDifference:number;
}
