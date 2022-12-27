import { Component, OnInit, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { MenuClass } from 'src/app/Service-Class/menu-class';
import { Config, Menu } from 'src/app/types';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent implements OnInit {
  @Input() options;
  @Input() menuList: MenuClass[];
  //@Input() menus: Menu[];

  config: Config;
  usergroup: string;
  isLoggedIn = false;
  isLoggedIn1 = false;
  constructor(public translate: TranslateService){
     }
     browserLang:any;
  ngOnInit() {

    this.browserLang=localStorage.getItem("browserLang");
    if(this.browserLang===undefined || this.browserLang===null)
    this.browserLang='en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    console.log("this.browserLang",this.browserLang);

    this.config = this.mergeConfig(this.options);

    this.usergroup=localStorage.getItem('usergroup');
    // console.log("usergroup:"+this.usergroup);
    // if(this.usergroup==='dngdpadmin' ||  this.usergroup=='dngdpteam' || this.usergroup=='partner' || this.usergroup=='dntcef'){
    //   this.isLoggedIn =true;
    // }

    // if(this.usergroup==='dnpo' || this.usergroup==='dnped'
    // || this.usergroup==='dnma' || this.usergroup==='dncp' || this.usergroup==='cedsif' || this.usergroup==='bankomoz'){
    //   this.isLoggedIn1 = true;
    // }

    // console.log("isLoggedIn:"+this.isLoggedIn);
    // console.log("isLoggedIn1:"+this.isLoggedIn1);
  }

  mergeConfig(options: Config) {

    const config = {

      multi: true
    };

    return { ...config, ...options };
  }

  // toggle(index: number) {

  //   if (!this.config.multi) {
  //     this.menus.filter(
  //       (menu, i) => i !== index && menu.active
  //     ).forEach(menu => menu.active = !menu.active);


  //   }


  //   this.menus[index].active = !this.menus[index].active;
  //   // this.menus[index].submenu[index].active=!this.menus[index].submenu[index].active;
  // }

  //for dynamic
  toggle(index: number) {

    if (!this.config.multi) {
      this.menuList.filter(
        (menu, i) => i !== index && menu.active
      ).forEach(menu => menu.active = !menu.active);


    }


    this.menuList[index].active = !this.menuList[index].active;
    // this.menus[index].submenu[index].active=!this.menus[index].submenu[index].active;
  }
}

