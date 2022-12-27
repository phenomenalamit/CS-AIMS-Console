import { AssignGroup } from "./assign-group";
import { UserAssignGroupPermissionModel } from "./user-assign-group-permission-model";

export class UserTypeClass {
    userType!:string;
    userTypeId!:number;
    userStatus!:number;
    assignGroupArr: AssignGroup[];
    createdBy!:string;  //field used to be during get
    userTypeAssignGroup:AssignGroup[]; //field to be used during get
    userAssignGroupPermissionModel!:UserAssignGroupPermissionModel[]; //field to be used during get
    userAccessId!:number; //only used in assgn group
    language:string;
}
