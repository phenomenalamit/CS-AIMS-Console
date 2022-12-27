import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-type-component',
  templateUrl: './user-type-component.component.html',
  styleUrls: ['./user-type-component.component.css']
})
export class UserTypeComponentComponent implements OnInit {
  num:any;
    tabClick(index: number) {
      this.num=index;
    }

  constructor(private router:Router,public translate: TranslateService) { }
  browserLang: any;
  ngOnInit(): void {
    this.browserLang=localStorage.getItem("browserLang");
    if(this.browserLang===undefined || this.browserLang===null)
    this.browserLang='en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
  }

}
