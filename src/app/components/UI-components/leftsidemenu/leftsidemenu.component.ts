import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Config, Menu } from 'src/app/types';
import { AlertNotificationDialogComponent } from '../../dialogbox-components/alert-dialogbox-component/alert-notification/alert-notification.component';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { Notification } from 'src/app/Service-Class/notification';
import { PrimaryLinkService } from 'src/app/Service-Application/primary-link.service';
import { PrimaryLink } from 'src/app/Service-Class/primary-link';
import { MenuClass, SubMenu } from 'src/app/Service-Class/menu-class';
import { LanguagemasterService } from 'src/app/Service/languagemaster.service';
import { UserAccessClass } from 'src/app/Service-Class/user-access-class';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/Service/login.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

@Component({
  selector: 'app-leftsidemenu',
  templateUrl: 'leftsidemenu.component.html',
  styleUrls: ['leftsidemenu.component.css']
})
export class LeftsidemenuComponent implements OnInit {


  usergroup: any;
  public scrollbarOptions = { axis: 'y', theme: 'minimal' };
  title = 'angular-poc2';
  name = 'Angular 6';
  isLoggedIn = false;
  primaryLinkList: PrimaryLink[] = [];
  userAccessPermArr:UserAccessPermission[]=[];
  userAccessDetailsBean:UserAccessClass;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;


  browserLang: any=null;
  messageAlert: any;
  notificationMsgList: Notification[]=[];
  userName: string;
  email: string;
  userFullName:string=null;
  userEmail:string=null;
  avtarUrl:any="./assets/images/blankImage.jpg";
  // routerLink='/admin/changePassword';
  ngOnInit(): void {
    if(localStorage.getItem("token")===undefined || localStorage.getItem("token")===null || localStorage.getItem("token")===''){
      // localStorage.removeItem("loggedout");
      // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/', ]);
     }
    this.userName = localStorage.getItem('userName');
    this.email = localStorage.getItem('email');
    // this.getNotificationDetails();
    this.loadPrimaryLinkList();
    this.openSessionExpireOnIdealPopUp();
    //this.getPrimaryLinkDetails();
    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');

    this.usergroup = localStorage.getItem('usergroup');


    this.messageAlert =
      //[{'message':'Your Password is going to expire in 7 days. Please change your password.Follow the link to change your password.','link':'http://localhost:4200/#/admin/changePassword','date':'March 12, 2020'},
      [{ 'message': 'Sourav Password is going to expire in 7 days. Please change your password.Follow the link to change your password.', 'routerLink': '/admin/changePassword', 'date': 'March 12, 2020' },
      { 'message': 'Project-001 is funded by organization-World Bank.', 'routerLink': '', 'date': 'March 10, 2020' },
      { 'message': 'World bank is added to funding organization.', 'routerLink': '', 'date': 'March 7, 2020' }
      ]

    // Theme

    var lstorageThemeval = localStorage.getItem("webtheme");
    var lstorageSideThemeval = localStorage.getItem("sidetheme");

    // alert(lstorageThemeval);
    if (lstorageThemeval !== "") {

      $('.theme-seeting ul li a').removeClass('active');
      $('head').append('<link id="darkTheme"  href="../assets/css/' + lstorageThemeval + '.css" rel="stylesheet"  />');
      $('#' + lstorageThemeval).addClass('active');
      //alert(0);
    }

    if (lstorageThemeval == null) {
      ///alert(1);
      localStorage.removeItem('webtheme');
      $('head').find("#darkTheme").remove();
    }


    $('.dark-theme').on('click', function () {
      $('.theme-seeting ul li a').removeClass('active');
      $(this).addClass('active');



      if (typeof (Storage) !== "undefined") {

        localStorage.setItem("webtheme", 'Darkstyle');
        var lstorageThemeval = localStorage.getItem("webtheme");
        //alert(lstorageThemeval);
        $('head').append('<link id="darkTheme"  href="../assets/css/' + lstorageThemeval + '.css" rel="stylesheet"  />');



      }
    });

    $('.light-theme').on('click', function () {
      localStorage.removeItem('webtheme');
      $('head').find("#darkTheme").remove();
    })


    $('#sidebarToggle').on('click', function (event) {
      event.stopPropagation();
      $(this).toggleClass('on');
      $('.wrapper').toggleClass('display-full');
      $('.leftmenu').toggleClass('active');
    })


    var windowWidth = $(window).width();
    if (windowWidth < 800) {
      // $(document).on("click",'.wrapper', function(event){
      //  var $trigger = $("#sidebarToggle");
      // if($trigger !== event.target && ! $trigger.has(event.target).length){
      //   $(this).removeClass('display-full');
      //    $('.leftmenu').removeClass('active');
      // }
      //  });


      $(document).on("click", function (event) {
        if (!$(event.target).hasClass('mainmenu') && !$(event.target).hasClass('ng-star-inserted')) {
          $('.wrapper').removeClass('display-full');
          $('.leftmenu').removeClass('active');
        }
      });



    }


    // if (lstorageSideThemeval == null) {
    //     localStorage.removeItem('sidetheme');
    // }



    // if (lstorageSideThemeval !== "") {

    //     $('.SideNavBG ul li a').removeClass('active');
    //     $('head').append('<link id="' + lstorageSideThemeval + 'css"  href="../assets/css/' + lstorageSideThemeval + '.css" rel="stylesheet"  />');
    //     $('#' + lstorageSideThemeval).addClass('active');
    // }


    // $('.SideNavBG ul li a').on('click', function () {
    //     $('.SideNavBG ul li a').removeClass('active');
    //     $(this).addClass('active');

    //     $('head').find("#" + lstorageSideThemeval + 'css').remove();
    //     var themeid = $(this).attr("id");
    //     //alert(themeid);

    //     if (typeof (Storage) !== "undefined") {

    //         localStorage.setItem("sidetheme", themeid);
    //         var lstorageSideThemeval = localStorage.getItem("sidetheme");
    //         //alert(lstorageThemeval);
    //         $('head').append('<link id="' + lstorageSideThemeval + 'css"  href="../assets/css/' + lstorageSideThemeval + '.css" rel="stylesheet"  />');
    //     }
    // });


    $('#styles').on('click', function () {
      localStorage.removeItem('webtheme');
      // alert(lstorageThemeval);
      $('head').find("#" + lstorageThemeval + 'css').remove();
    });


    // $(".topmenu").click(function(){
    //   $(".submenu").not($(this).next()).slideUp("fast");
    //   $(this).next(".submenu").slideToggle("fast");

    // });

    $(document).ready(function () {
      // $(".submenu li").click(function () {
      //   $(".submenu li").removeClass("active");
      //   $(this).addClass("active");
      // });
      $('.submenu ').find('li a').click(function () {
        var $this = $(this);
        $('a').removeClass('active');
        $this.addClass('active');
      });

      jQuery('.leftmenu').hover(function () {
        jQuery('body').addClass('sideToggle');
      }, function () {
        jQuery('body').removeClass('sideToggle');
      });


    });



    // $(document).on("click", function(event){
    //   if(!$(event.target).closest(".topmenu").length){
    //       $(".submenu").slideUp("fast");

    //   }
    // });

  }

  constructor(private router: Router,
    private dialog: MatDialog, public translate: TranslateService, private primaryLinkService: PrimaryLinkService, 
    private notificationService: NotificationService,private loginService: LoginService,
    private idle: Idle, private keepalive: Keepalive) {

    translate.addLangs(['en', 'pt']);
    translate.setDefaultLang('pt');
    this.browserLang = localStorage.getItem("browserLang");
    console.log("browserLang ",this.browserLang);
    if(this.browserLang==null)
    localStorage.setItem("browserLang",'pt');
    this.browserLang = localStorage.getItem("browserLang");

  }

  // private getPrimaryLinkDetails() {
  //   this.primaryLinkService.getPrimaryLinkListWithStatusActive().subscribe(data => {

  //     this.primaryLinkList = data;
  //     console.log("primaryLink details leftside menu==", this.primaryLinkList);
  //     this.setMenu();

  //   });
  // }
  switchLanguage(language: string) {
    localStorage.setItem("browserLang", language);
    this.translate.use(language);
    let currentUrl = this.router.url;
    let crntUrlChk=((currentUrl).split('/'))[2]
    if(crntUrlChk.includes("view")){
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
    }else{

    }
    // if((currentUrl == '/admin/envelope') || (currentUrl == '/admin/project') || (currentUrl == '/admin/funding') ||
    // (currentUrl == '/admin/disbursement') || (currentUrl == '/admin/payment') || (currentUrl == '/admin/organization') || (currentUrl == '/admin/individual') || (currentUrl == '/admin/monitoring')
    // || (currentUrl == '/admin/user-type')|| (currentUrl == '/admin/user-account')|| (currentUrl == '/admin/user-mapping')|| (currentUrl == '/admin/user-access-management')
    // || (currentUrl == '/admin/field-management')|| (currentUrl == '/admin/exchange-rate-administartion')|| (currentUrl == '/admin/suggestion-administartion')
    // || (currentUrl == '/admin/folder-structure-administartion')|| (currentUrl == '/admin/report-administration')|| (currentUrl == '/admin/bulk-mail-adminstration')
    // || (currentUrl == '/admin/global-link')|| (currentUrl == '/admin/primary-link')|| (currentUrl == '/admin/function-master') || (currentUrl == '/admin/dashboard')){

    // }else{
     
    // }
    
  }

  options: Config = { multi: false };

  //author of setMenu Sourav Kumar Nayak
  menuList: MenuClass[] = [];
  menuList2: Map<String, Menu> = new Map<String, Menu>();
  setMenu() {
    //as dashbord is not coming from db add it as statically
    // let dashMenu = new MenuClass();
    // dashMenu.name = "Dashboard";
    // dashMenu.routerLink = '/admin/dashboard';
    // dashMenu.submenu = [];
    // dashMenu.active = false;
    // dashMenu.iconClass = 'fas fa-tachometer-alt';
    // dashMenu.mainLink = 'MainClass';
    // this.menuList.push(dashMenu);
    // //collect other details from db
    // for (let i = 0; i < this.primaryLinkList.length; i++) {
    //   let menu: MenuClass = new MenuClass();
    //   menu.name = this.primaryLinkList[i].globalLinkData[0].globalLinkName;
    //   menu.routerLink = '';
    //   menu.iconClass = this.primaryLinkList[i].globalLinkData[0].icon;
    //   menu.active = false;
    //   menu.mainLink = 'MainClass';
      
    //   for (let j = 0; j < this.primaryLinkList[i].functionMasterData.length; j++) {
    //     for(let k =0; k< this.userAccessPermArr.length;k++){
    //       if(this.primaryLinkList[i].primaryLinkName == this.userAccessPermArr[k].primaryLinkName){
    //         let submenu = new SubMenu();
    //         submenu.name = this.primaryLinkList[i].primaryLinkName;
    //         submenu.routerLink = this.primaryLinkList[i].functionMasterData[j].fileName;
    //         submenu.globalLink = 'SubClass';
    //         submenu.active = false;
    //         menu.submenu.push(submenu);
    //         console.log("count::"+k);
    //         this.menuList.push(menu);
    //       }
    //     }
        
    //   }
      
    //}
    //as dashbord is not coming from db add it as statically
    let dashMenu = new MenuClass();
    dashMenu.name = "Dashboard";
    dashMenu.routerLink = '/admin/dashboard';
    dashMenu.submenu = [];
    dashMenu.active = false;
    dashMenu.iconClass = 'fas fa-tachometer-alt';
    dashMenu.mainLink = 'MainClass';
    this.menuList.push(dashMenu);
    // console.log("primaryLinkList size:"+this.primaryLinkList.length);
    //collect other details from db
    for (let i = 0; i < this.primaryLinkList.length; i++) {
      let menu: MenuClass = new MenuClass();
      menu.name = this.primaryLinkList[i].globalLinkData[0].globalLinkName;
      menu.routerLink = '';
      menu.iconClass = this.primaryLinkList[i].globalLinkData[0].icon;
      menu.active = false;
      menu.mainLink = 'MainClass';
      // console.log("this.primaryLinkList[i].functionMasterData.length:"+this.primaryLinkList[i].functionMasterData.length);
      for (let j = 0; j < this.primaryLinkList[i].functionMasterData.length; j++) {
        // console.log("this.primaryLinkList[i].functionMasterData:"+this.primaryLinkList[i].functionMasterData[j].fileName);
        let submenu = new SubMenu();
        submenu.name = this.primaryLinkList[i].primaryLinkName;
        submenu.routerLink = this.primaryLinkList[i].functionMasterData[j].fileName;
        submenu.globalLink = 'SubClass';
        submenu.active = false;
        menu.submenu.push(submenu);
      }
      this.menuList.push(menu);
    }
    // console.log("this.menuList.length:"+this.menuList.length);
    for (let i = 0; i < this.menuList.length; i++) {
      // console.log("submenu:"+this.menuList[i].submenu);
      // console.log("submenu length:"+this.menuList[i].submenu.length);
      // console.log("this.menuList[i].name:"+this.menuList[i].name);
      if ((this.menuList2.get(this.menuList[i].name)) == null || (this.menuList2.get(this.menuList[i].name)) == undefined){
        // console.log("1");
        this.menuList2.set(this.menuList[i].name, this.menuList[i]);
      }
      else {
        // console.log("2");
        // console.log("this.menuList[i].submenu[0].name:"+this.menuList[i].submenu[0].name);
        this.menuList2.get(this.menuList[i].name).submenu.push(this.menuList[i].submenu[0]);
      }
    }
    this.menuList = [];
    this.menuList2.forEach(element => {
      this.menuList.push(element);
    });
  }

  menus: Menu[] = [
    {
      name: 'Dashboard',
      routerLink: '/admin/dashboard',
      mainLink: 'MainClass',
      iconClass: 'fas fa-tachometer-alt',
      active: false,
      submenu: [

        // { name: 'View Dasboard', routerLink:'/admin/dashboard'},
      ]
    },
    {
      name: 'Envelope',
      routerLink: '',
      iconClass: 'far fa-envelope',
      mainLink: 'MainClass',
      active: false,
      submenu: [
        { name: 'Create Envelope', routerLink: '/admin/envelope', globalLink: 'SubClass', active: false },
        { name: 'View Envelope List', routerLink: '/admin/view-envelope', globalLink: 'SubClass', active: false }
        //{ name: 'Javascript', url: '#' }
      ]
    }
    ,


    {
      name: 'Financial Agreement',
      routerLink: '',
      iconClass: 'fas fa-piggy-bank',
      mainLink: 'MainClass',
      active: false,
      submenu: [
        { name: 'Create Financial Agreement', routerLink: '/admin/funding', globalLink: 'SubClass', active: false },
        { name: 'View Financial Agreement', routerLink: '/admin/view-funding', globalLink: 'SubClass', active: false }
        //{ name: 'Javascript', url: '#' }
      ]
    },
    {
      name: 'Project',
      routerLink: '',
      iconClass: 'fas fa-chart-area',
      mainLink: 'MainClass',
      active: false,
      submenu: [
        { name: 'Create Project', routerLink: '/admin/project', globalLink: 'SubClass', active: false },
        { name: 'View Project List', routerLink: '/admin/view-project', globalLink: 'SubClass', active: false },
        // { name: 'Desktop', url: '#' }
      ]
    },
    {
      name: 'Disbursement',
      routerLink: '',
      iconClass: 'far fa-credit-card',
      mainLink: 'MainClass',
      active: false,
      submenu: [
        { name: 'Create Disbursement', routerLink: '/admin/disbursement', globalLink: 'SubClass', active: false },
        { name: 'View Disbursement List', routerLink: '/admin/view-disbursement', globalLink: 'SubClass', active: false },
        // { name: 'Desktop', url: '#' }
      ]
    },

    {
      name: 'Payment',
      routerLink: '',
      iconClass: 'fas fa-piggy-bank',
      mainLink: 'MainClass',
      active: false,
      submenu: [
        { name: 'Create Payment', routerLink: '/admin/payment', globalLink: 'SubClass', active: false },
        { name: 'View Payment List', routerLink: '/admin/view-payment', globalLink: 'SubClass', active: false },
        // { name: 'Desktop', url: '#' }
      ]
    },

    {
      name: 'Organization',
      routerLink: '',
      iconClass: 'far fa-building',
      mainLink: 'MainClass',
      active: false,
      submenu: [
        { name: 'Create Organization', routerLink: '/admin/organization', globalLink: 'SubClass', active: false },
        { name: 'View Organization List', routerLink: '/admin/view-organization', globalLink: 'SubClass', active: false },
        // { name: 'Desktop', url: '#' }
      ]
    }
    ,

    {
      name: 'Individual',
      routerLink: '',
      iconClass: 'far fa-bookmark',
      mainLink: 'MainClass',
      active: false,
      submenu: [
        { name: 'Create Individual', routerLink: '/admin/individual', globalLink: 'SubClass', active: false },
        { name: 'View Individual List', routerLink: '/admin/view-individual', globalLink: 'SubClass', active: false },
        // { name: 'Desktop', url: '#' }
      ]
    }
    ,



    {
      name: 'Monitoring',
      routerLink: '',
      iconClass: 'fa fa-desktop',
      mainLink: 'MainClass',
      active: false,
      submenu: [
        // { name: 'Create Monitoring', routerLink:'/admin/monitoring',globalLink:'SubClass',active: false },
        { name: 'Create Monitoring', routerLink: '/admin/monitoring', globalLink: 'SubClass', active: false },
        { name: 'View Monitoring', routerLink: '/admin/view-monitoring', globalLink: 'SubClass', active: false },
        // { name: 'Desktop', url: '#' }
      ]
    },

    // {
    //   name: 'User Account',
    //   routerLink:'',
    //   iconClass: 'far fa-user',
    //   mainLink:'MainClass',
    //   active: false,
    //   submenu: [
    //     { name: 'Create User Account', routerLink:'/admin/userAccount',globalLink:'SubClass',active: false },
    //     { name: 'View User Account List',  routerLink:'/admin/view-user-account',globalLink:'SubClass',active: false  },
    //     // { name: 'Desktop', url: '#' }
    //   ]
    // },


    {
      name: 'User Management',
      routerLink: '',
      iconClass: 'fa fa-users',
      mainLink: 'MainClass',
      active: false,
      submenu: [
        { name: 'User Type', routerLink: '/admin/user-type', globalLink: 'SubClass', active: false },
        { name: 'User Account', routerLink: '/admin/user-account', globalLink: 'SubClass', active: false },
        { name: 'User Mapping', routerLink: '/admin/user-mapping', globalLink: 'SubClass', active: false },
        { name: 'User Access Management', routerLink: '/admin/user-access-management', globalLink: 'SubClass', active: false },


        // { name: 'View User Account',  routerLink:'/admin/view-user-account'  },
        // { name: 'Desktop', url: '#' }
      ]
    }
    ,

    {
      name: 'Link Management',
      routerLink: '',
      iconClass: 'fa fa-link',
      mainLink: 'MainClass',
      active: false,
      submenu: [
        { name: 'Create Global Link', routerLink: '/admin/global-link', globalLink: 'SubClass', active: false },
        { name: 'View Global Link', routerLink: '/admin/view-global-link', globalLink: 'SubClass', active: false },
        { name: 'Create Primary Link', routerLink: '/admin/primary-link', globalLink: 'SubClass', active: false },
        { name: 'View Primary Link', routerLink: '/admin/view-primary-link', globalLink: 'SubClass', active: false },
        { name: 'Create Function Master', routerLink: '/admin/function-master', globalLink: 'SubClass', active: false },
        { name: 'View Function Master', routerLink: '/admin/view-function-master', globalLink: 'SubClass', active: false },


      ]
    },

    {
      name: 'Administration',
      routerLink: '',
      iconClass: 'fa fa-link',
      mainLink: 'MainClass',
      active: false,
      submenu: [
        { name: 'Code List Management', routerLink: '/admin/field-management', globalLink: 'SubClass', active: false },
        //  { name: 'Primary Link', routerLink:'/admin/primary-link',globalLink:'SubClass',active: false },
        { name: 'Exchange Rate Administration', routerLink: '/admin/exchange-rate-administartion', globalLink: 'SubClass', active: false },
        { name: 'Suggestion Administration', routerLink: '/admin/suggestion-administartion', globalLink: 'SubClass', active: false },
        { name: 'Folder Structure', routerLink: '/admin/folder-structure-administartion', globalLink: 'SubClass', active: false },
        { name: 'View Folder Structure', routerLink: '/admin/view-folder-structure-administartion', globalLink: 'SubClass', active: false },
        { name: 'Report Administration', routerLink: '/admin/report-administration', globalLink: 'SubClass', active: false },
        { name: 'View Column Access', routerLink: '/admin/view-column-access', globalLink: 'SubClass', active: false },
        { name: 'Bulk Mail Administration', routerLink: '/admin/bulk-mail-adminstration', globalLink: 'SubClass', active: false }
      ]
    }


    // {
    //   name: 'Web Browser',
    //   iconClass: 'fa fa-globe',
    //   active: false,
    //   submenu: [
    //     { name: 'Chrome', url: '#' },
    //     { name: 'Firefox', url: '#' },
    //     { name: 'Desktop', url: '#' }
    //   ]
    // }
  ];

  // toggle(index: number) {

  //     this.menus.filter(
  //       (menu, i) => i !== index && menu.active
  //     ).forEach(menu => menu.active = !menu.active);


  //   this.menus[index].active = !this.menus[index].active;
  // }
  openMyMenu() {
    this.trigger.toggleMenu();
  }
  closeMyMenu() {
    this.trigger.closeMenu();
    // console.log('close')
  }

  loadPrimaryLinkList(){
    this.primaryLinkList = JSON.parse(localStorage.getItem('pLinkLoginList'));
    // console.log('Primary link from leftside menu local storage===>',this.primaryLinkList);
    this.userAccessDetailsBean=JSON.parse(localStorage.getItem("userAccessAllDetails"));
    this.setUserProfileData();
    this.userAccessPermArr = JSON.parse(localStorage.getItem('uAccessPermArr'));
    this.setMenu();
  }

  setUserProfileData(){
    this.userFullName=this.userAccessDetailsBean.firstName+' '+this.userAccessDetailsBean.lastName;
    this.userEmail=this.userAccessDetailsBean.email;
    if(this.userAccessDetailsBean.image == null || this.userAccessDetailsBean.image == undefined || this.userAccessDetailsBean.image == '') {
      this.avtarUrl="./assets/images/blankImage.jpg";
    }
    else{
      this.avtarUrl='data:image/png;base64,' +this.userAccessDetailsBean.image;
    }
  }








  openDialog(j: any) {
    if (this.notificationMsgList[j].notificationMsg.indexOf("disbursement") != -1) {
      localStorage.setItem("notificationLink", "/admin/view-disbursement");
    }
    else if ((this.notificationMsgList[j].notificationMsg.indexOf("envelope") != -1)) {
      localStorage.setItem("notificationLink", "/admin/view-envelope");
    }
    else if ((this.notificationMsgList[j].notificationMsg.indexOf("financial") != -1)) {
      localStorage.setItem("notificationLink", "/admin/view-funding");
    }
    else if ((this.notificationMsgList[j].notificationMsg.indexOf("project") != -1)) {
      localStorage.setItem("notificationLink", "/admin/view-project");
    }
    else if ((this.notificationMsgList[j].notificationMsg.indexOf("payment") != -1)) {
      localStorage.setItem("notificationLink", "/admin/view-payment");
    }
    else if ((this.notificationMsgList[j].notificationMsg.indexOf("organization") != -1)) {
      localStorage.setItem("notificationLink", "/admin/view-organization");
    }
    else if ((this.notificationMsgList[j].notificationMsg.indexOf("individual") != -1)) {
      localStorage.setItem("notificationLink", "/admin/view-individual");
    }
    else if ((this.notificationMsgList[j].notificationMsg.indexOf("monitoring") != -1)) {
      localStorage.setItem("notificationLink", "/admin/view-monitoring");
    }
    else if ((this.notificationMsgList[j].notificationMsg.indexOf("password") != -1)) {
      localStorage.setItem("notificationLink", "/admin/changePassword");
    }
    const dialogRef = this.dialog.open(AlertNotificationDialogComponent,

      { width: '500px', data: this.notificationMsgList[j] });

    // dialogRef.afterClosed().subscribe(result => {
    //   this.router.navigate(['organization']);
    //   console.log(`Dialog result: ${result}`);
    // });
  }
  clearForm(form: FormGroup) {
    form.reset();
  }

  getNotificationDetails() {
    this.notificationService.getNotificationDetails().subscribe(data => {
      this.notificationMsgList = data;
      this.checkFinancialAgreementOngoing();
    });
  }

  //by Sourav Kumar Nayak
  checkFinancialAgreementOngoing(){
    this.notificationService.checkFinancialAgreementOngoing().subscribe(data =>{
      data.forEach(ele=>{
        this.notificationMsgList.push(ele);
      });
      this.checkFinancialAgreementEntersTheFinalYear();
    });
  }

  checkFinancialAgreementEntersTheFinalYear(){
    this.notificationService.checkFinancialAgreementEntersTheFinalYear().subscribe(data=>{
      data.forEach(ele=>{
        this.notificationMsgList.push(ele);
      });
      this.checkProjectOngoing();
    });
  }

  checkProjectOngoing(){
    this.notificationService.checkProjectOngoing().subscribe(data=>{
      data.forEach(ele=>{
        this.notificationMsgList.push(ele);
      });
      this.projectWithNoUpdates();
    });
  }

  projectWithNoUpdates(){
    this.notificationService.projectWithNoUpdates().subscribe(data=>{
      data.forEach(ele=>{
        this.notificationMsgList.push(ele);
      });
      this.financialAgreementWithNoUpdates();
    });
  }

  financialAgreementWithNoUpdates(){
    this.notificationService.financialAgreementWithNoUpdates().subscribe(data=>{
      data.forEach(ele=>{
        this.notificationMsgList.push(ele);
      });
      // console.log(this.notificationMsgList);
    });
  }

  onLogout() {
    localStorage.removeItem("uAccessPermArr");
    localStorage.removeItem("pLinkLoginList");
    localStorage.removeItem("userAccessAllDetails");
    localStorage.removeItem("usergroup");
    localStorage.removeItem("tokenForEsnip");
    localStorage.removeItem("tokenRequestBody");
    localStorage.removeItem("browserLang");
    localStorage.removeItem("token");
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.setItem("loggedout","loggedout");
    this.router.navigate(['/']);
  }

  //by Sourav Kumar Nayak
  openSessionExpireOnIdealPopUp(){
    //setIdel asks what is the ideal period in second
    this.idle.setIdle(1800);
    //setTimeout asks for worning before given second
    this.idle.setTimeout(3);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onTimeout.subscribe(() => {
      Swal.fire({
        title: (this.browserLang=='en')? 'Your session is expired. Please login again':'A sua sessão expirou. Por favor faça login novamente',
        confirmButtonText: `OK`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.onLogout();
        }
        else {
          this.onLogout();
        }
      });
    });
    this.idle.onTimeoutWarning.subscribe(
      (countdown) =>
        //console.log('You will time out in ',countdown)
        {}
    );
    this.keepalive.interval(5);
    this.keepalive.onPing.subscribe(() => {});
    this.idle.watch();
  }

  //by sourav kumar nayak
  openSessionExpireReloginPopup(){
    let token:string=localStorage.getItem('token');
    let retriveData:any;
    let retriveData1:any;
    this.loginService.getExpirationTimeMilliToken(token).subscribe(data=>{
      retriveData=data;
      setTimeout(() =>
        {
          Swal.fire({
            title: 'Your Session Is Going To Expire In 3 Minutes. Do You Want To Continue?',
            showDenyButton: true,
            confirmButtonText: `Yes`,
            denyButtonText: `No`,
            timer:120000
          }).then((result) => {
            if (result.isConfirmed) {
              let tokenRequestBody=JSON.parse(localStorage.getItem("tokenRequestBody"));
              this.loginService.getToken(tokenRequestBody).subscribe(obj=>{
                let response:any = obj;
                localStorage.setItem('token',response.token);
                this.openSessionExpireReloginPopup();
              });
            }
            else {
              this.loginService.getExpirationTimeMilliToken(token).subscribe(data=>{
                retriveData1=data;
                setTimeout(() =>
                  {
                    Swal.fire({
                      title: 'Your Session is Expired Please Relogin',
                      confirmButtonText: `OK`,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        this.onLogout();
                      }
                      else {
                        this.onLogout();
                      }
                    });
                  },retriveData1.differInMilliSecs
                );
              });
            }
          });
        },retriveData.differInMilliSecs-180000
      );
    });
  }


}

export class UserAccessPermission{
  primaryLinkId!:number;
  primaryLinkName!:string;
  permissionArr:number[]=[];
}
