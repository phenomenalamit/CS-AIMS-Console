export class MenuClass {
    name: string;
    routerLink:string;
    iconClass: string;
    mainLink:string;
    active: boolean;
    submenu: SubMenu[]=[];
}

export class SubMenu{
    name: string;
    routerLink: string;
    globalLink:string;
    active:boolean;
}

