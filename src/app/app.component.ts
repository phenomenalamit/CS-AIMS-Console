import { Component ,ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// import { MatMenuTrigger } from '@angular/material/menu';
// import { LabelMaster } from './label-master';
// import { LanguageMaster } from './language-master';
// import { LanguagemasterService } from './languagemaster.service';
// import {MatMenuTrigger} from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  onActivate(event) {
    window.scroll(0,0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
    
}
  // allLanguageLabelData: LabelMaster[] = new Array();
  // selectedLanguagelabelData: LabelMaster[] = new Array();
  // translateLanguageFromSelected!: number;
  // languages!: LanguageMaster[];


  title = 'angular-poc2';
  name = 'Angular 6';
  isLoggedIn = false;
    // @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

    constructor(private router: Router) {}

  ngOnInit() {
    // this.router.navigate(['/admin/dashboard'])
    this.router.events.subscribe((evt) => {
                if (!(evt instanceof NavigationEnd)) {
                    return;
                }
               window.scrollTo(0, 0)
            });
  
} 


}