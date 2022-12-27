import { GlobalLink } from '../model/global-link';
import { FunctionMaster } from '../model/function-master';

export class PrimaryLink {
    primaryLinkId!: number;
    functionId!: number;
    globalLinkId!: number;
    primaryLinkName!:string;
    primaryLinkNamePt!:string;
    globalLinkName!:string;
    globalLinkNamePt!:string;
    functionName!:string;
    functionNamePt!:string;
    status!:string;
    globalLinkArr: GlobalLink[];
    globalLinkData:GlobalLink[];
    functionMasterData:FunctionMaster[];
    functionMasterArr: FunctionMaster[];
    primaryLinkPermissions:any[];
}

export class PrimaryLinkFilterBean {
    primaryLinkNames:string[] = [];
    functionMasterNames:string[] = [];
    globalLinkNames:string[] = [];
    status:string[] = [];
}
