export type Menu = {
    name: string, 
    routerLink:string,
    iconClass: string, 
    mainLink:string,
    active: boolean,
    submenu: { name: string, routerLink: string ,globalLink:string,active:boolean}[]
  }