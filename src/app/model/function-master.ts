export class FunctionMaster {
    functionId!: number;
    functionName!:string;
    functionNamePt!:string;
    fileName!:string;
    description!:string;
    descriptionPt!:string;
    action!:string;
    status!:string;
}

export class FunctionMasterFilterBean {
    functionMasterNames:string[] = [];
    fileName:string[] = [];
    status:string[] = [];
}
