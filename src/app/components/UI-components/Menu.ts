
export type Menu = {
    name: string, 
    iconClass: string, 
    mainLink:string,
    active: boolean,
    submenu: { name: string, url: string ,globalLink:string}[]
  }
