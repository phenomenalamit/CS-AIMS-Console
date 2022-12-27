import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EnvelopeComponent } from './components/main-components/envelope/envelope.component';
import { OrganizationComponent } from './components/main-components/organization/organization.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
 import {MatFormFieldModule} from '@angular/material/form-field';
 import {MatInputModule} from '@angular/material/input';
 import {MatSelectModule} from '@angular/material/select';
 import {MatButtonModule} from '@angular/material/button';
 import {MatToolbarModule} from '@angular/material/toolbar';
 import {MatTableModule} from '@angular/material/table';
 import {MatCardModule} from '@angular/material/card';
 import {MatPaginatorModule} from '@angular/material/paginator';
 import {MatDatepickerModule} from '@angular/material/datepicker';
 import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
 import {MatNativeDateModule, MatPseudoCheckboxModule} from '@angular/material/core';
 import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
 import{ BrowserAnimationsModule} from '@angular/platform-browser/animations';
 import {MatIconModule} from '@angular/material/icon';
 import {MatTabsModule} from '@angular/material/tabs';
 import {MatExpansionModule} from '@angular/material/expansion';
 import { MatMenuModule } from '@angular/material/menu';
import { LeftsidemenuComponent }  from './components/UI-components/leftsidemenu/leftsidemenu.component';
import { LoginscreenComponent }  from './components/UI-components/loginscreen/loginscreen.component';
import { AdminmasterComponent } from './adminmaster/adminmaster.component';
import { FootersecComponent }  from './components/UI-components/footersec/footersec.component';
import { DashboardComponent } from './components/UI-components/dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { PaymentComponent } from './components/main-components/payment/payment.component';
import { ProjectComponent } from './components/main-components/project/project.component';

import { MatSliderModule } from '@angular/material/slider';

import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MonitoringComponent } from './components/main-components/monitoring/monitoring.component';

import { PiechartdashComponent } from './components/UI-components/Dashboardchart/piechartdash/piechartdash.component';
import { DashchartComponent }  from './components/UI-components/Dashboardchart/dashchart/dashchart.component';
import { LinechartdashComponent } from './components/UI-components/Dashboardchart/linechartdash/linechartdash.component';
import { FundingComponent, MY_FORMATS } from './components/main-components/funding/funding.component';


import { from } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { ViewEnvelopeComponentComponent } from './components/view-components/view-envelope-component/view-envelope-component.component';
import { ViewIndividualComponentComponent } from './components/view-components/view-individual-component/view-individual-component.component';
import { ViewOrganizationComponentComponent } from './components/view-components/view-organization-component/view-organization-component.component';
import { ViewDisbursementComponentComponent } from './components/view-components/view-disbursement-component/view-disbursement-component.component';
import { ViewFundingComponentComponent } from './components/view-components/view-funding-component/view-funding-component.component';
import { ViewUserAccountComponentComponent } from './components/view-components/view-user-account-component/view-user-account-component.component';
import { ViewPaymentComponentComponent } from './components/view-components/view-payment-component/view-payment-component.component';
import { ViewProjectComponentComponent } from './components/view-components/view-project-component/view-project-component.component';
import { ViewMonitoringComponentComponent } from './components/view-components/view-monitoring-component/view-monitoring-component.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import {MatSortModule} from '@angular/material/sort';
import { UserProfileComponent } from './components/main-components/user-profile/user-profile.component';
import { ChangePasswordComponent }  from './components/UI-components/change-password/change-password.component';
import { AddEnvelopeComponentComponent } from './components/add-components/add-envelope-component/add-envelope-component.component';
import { AddOrganizationComponentComponent } from './components/add-components/add-organization-component/add-organization-component.component';

import { EditEnvelopeComponentComponent } from './components/edit-components/edit-envelope-component/edit-envelope-component.component';

import { AlertNotificationComponent }  from './components/UI-components/alert-notification/alert-notification.component';
import { AddIndividualComponentComponent } from './components/add-components/add-individual-component/add-individual-component.component';
import { AlertNotificationDialogComponent } from './components/dialogbox-components/alert-dialogbox-component/alert-notification/alert-notification.component';
import { PasswordComponent } from './components/UI-components/password/password.component';
import { BrowserModule } from '@angular/platform-browser';
import { DialogboxIndividualComponentsComponent } from './components/dialogbox-components/dialogbox-individual-components/dialogbox-individual-components.component';
import { DialogboxDisbursmentComponentComponent } from './components/dialogbox-components/dialogbox-disbursment-component/dialogbox-disbursment-component.component';
import { AddDisbursementComponent } from './components/add-components/add-disbursement/add-disbursement.component';
import { EditDisbursementComponent } from './components/edit-components/edit-disbursement/edit-disbursement.component';
import { DialogboxPaymentComponentComponent } from './components/dialogbox-components/dialogbox-payment-component/dialogbox-payment-component.component';
import { DialogboxUseraccountComponentComponent } from './components/dialogbox-components/dialogbox-useraccount-component/dialogbox-useraccount-component.component';
import { AddFundingComponent } from './components/add-components/add-funding/add-funding.component';
import { AddProjectComponentComponent } from './components/add-components/add-project-component/add-project-component.component';
import { EditFundingComponent } from './components/edit-components/edit-funding/edit-funding.component';
import { EditUserAccountComponentComponent } from './components/edit-components/edit-user-account-component/edit-user-account-component.component';
import { AddUserAccountComponentComponent } from './components/add-components/add-user-account-component/add-user-account-component.component';
import { AddPaymentComponentComponent } from './components/add-components/add-payment-component/add-payment-component.component';
import { EditPaymentComponentComponent } from './components/edit-components/edit-payment-component/edit-payment-component.component';
import { EditIndividualComponentComponent } from './components/edit-components/edit-individual-component/edit-individual-component.component';
import { EditProjectComponent } from './components/edit-components/edit-project/edit-project.component';
import { AccordionComponent } from './components/UI-components/accordion/accordion.component';
import { EditOrganizationComponentComponent } from './components/edit-components/edit-organization-component/edit-organization-component.component';




import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { UserTypeComponentComponent } from './components/administration-component/user-management/user-type-component/user-type-component.component';
import { AssignGroupComponentComponent } from './components/administration-component/user-management/assign-group-component/assign-group-component.component';
import { UserMappingComponentComponent } from './components/administration-component/user-management/user-mapping-component/user-mapping-component.component';
import { ManageUserComponentComponent } from './components/administration-component/user-management/manage-user-component/manage-user-component.component';
import { GlobalLinkComponentComponent } from './components/administration-component/link-management/global-link-component/global-link-component.component';
import { PrimaryLinkComponentComponent } from './components/administration-component/link-management/primary-link-component/primary-link-component.component';
import { ButtonComponentComponent } from './components/administration-component/link-management/button-component/button-component.component';
import { AddUserTypeComponentComponent } from './components/add-components/add-user-type-component/add-user-type-component.component';
import { ViewUserTypeComponentComponent } from './components/view-components/view-user-type-component/view-user-type-component.component';
import { AddUserMappingComponentComponent } from './components/add-components/add-user-mapping-component/add-user-mapping-component.component';
import { ViewUserMappingComponentComponent } from './components/view-components/view-user-mapping-component/view-user-mapping-component.component';
import { AddManageUserComponentComponent } from './components/add-components/add-manage-user-component/add-manage-user-component.component';
import { ViewManageUserComponentComponent } from './components/view-components/view-manage-user-component/view-manage-user-component.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatChipsModule} from '@angular/material/chips';
import { CreateGloballinkComponentComponent } from './components/administration-component/link-management/create-globallink-component/create-globallink-component.component';
import { CreatePrimaryLinkComponentComponent } from './components/administration-component/link-management/create-primary-link-component/create-primary-link-component.component';
import { FieldManagementComponent } from './components/administration-component/field-management/field-management.component';
import { FunctionMasterComponentComponent } from './components/administration-component/link-management/function-master-component/function-master-component.component';
import { ViewFunctionMasterComponentComponent } from './components/administration-component/link-management/view-function-master-component/view-function-master-component.component';

import { ViewGlobalLinkComponentComponent } from './components/administration-component/link-management/view-global-link-component/view-global-link-component.component';
import { AddMonitoringComponent } from './components/add-components/add-monitoring/add-monitoring.component';
import { EditGlobalLinkComponentComponent } from './components/administration-component/link-management/edit-global-link-component/edit-global-link-component.component';
import { ViewPrimaryLinkComponentComponent } from './components/administration-component/link-management/view-primary-link-component/view-primary-link-component.component';
import { EditMonitoringComponent } from './components/edit-components/edit-monitoring/edit-monitoring.component';
import { EditPrimaryLinkComponentComponent } from './components/administration-component/link-management/edit-primary-link-component/edit-primary-link-component.component';
import { EditFunctionMasterComponentComponent } from './components/administration-component/link-management/edit-function-master-component/edit-function-master-component.component';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MyLoaderComponent } from './components/my-loader/my-loader.component';
import { LoaderService } from './Service-Class/loader.service';
import { LoaderInterceptorService } from './interceptors/loader-interceptor.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ExchangeRateAdministrationComponent } from './components/administration-component/exchange-rate-administration/exchange-rate-administration.component';
import { DisbursementDocumentUploadComponent } from './components/document-repository/upload-document/disbursement-document-upload/disbursement-document-upload.component';
import { EnvelopeDocumentUploadComponent } from './components/document-repository/upload-document/envelope-document-upload/envelope-document-upload.component';
import { DisbursementDocumentViewComponent } from './components/document-repository/view-document/disbursement-document-view/disbursement-document-view.component';
import { EnvelopeDocumentViewComponent } from './components/document-repository/view-document/envelope-document-view/envelope-document-view.component';
import { FinancingDocumentUploadComponent } from './components/document-repository/upload-document/financing-document-upload/financing-document-upload.component';
import { ProjectDocumentUploadComponent } from './components/document-repository/upload-document/project-document-upload/project-document-upload.component';
import { PaymentDocumentUploadComponent } from './components/document-repository/upload-document/payment-document-upload/payment-document-upload.component';
import { MonitoringDocumentUploadComponent } from './components/document-repository/upload-document/monitoring-document-upload/monitoring-document-upload.component';
import { FinancingDocumentViewComponent } from './components/document-repository/view-document/financing-document-view/financing-document-view.component';
import { ProjectDocumentViewComponent } from './components/document-repository/view-document/project-document-view/project-document-view.component';
import { PaymentDocumentViewComponent } from './components/document-repository/view-document/payment-document-view/payment-document-view.component';
import { MonitoringDocumentViewComponent } from './components/document-repository/view-document/monitoring-document-view/monitoring-document-view.component';
import { AddMonitoringRevisedComponent } from './components/add-components/add-monitoring-revised/add-monitoring-revised.component';
import { MonitoringRevisedComponent } from './components/main-components/monitoring-revised/monitoring-revised.component';
import { IndividualComponent } from './components/main-components/individual/individual.component';
import { DisbursementComponent } from './components/main-components/disbursement/disbursement.component';
import { GlobalLinkComponent } from './components/administration-component/link-management/global-link/global-link.component';
import { PrimaryLinkComponent } from './components/administration-component/link-management/primary-link/primary-link.component';
import { FunctionMasterComponent } from './components/administration-component/link-management/function-master/function-master.component';
import { SnipPopupComponent } from './components/view-more-components/snip-popup/snip-popup.component';
import { ViewTableModalOrganizationComponent } from './components/view-more-components/view-table-modal-organization/view-table-modal-organization.component';
import { ViewTableModalIndividualComponent } from './components/view-more-components/view-table-modal-individual/view-table-modal-individual.component';
import { ViewTableModalEnvelopeComponent } from './components/view-more-components/view-table-modal-envelope/view-table-modal-envelope.component';
import { ViewTableModalProjectComponent } from './components/view-more-components/view-table-modal-project/view-table-modal-project.component';
import { ViewTableModalDisbursmentComponent } from './components/view-more-components/view-table-modal-disbursment/view-table-modal-disbursment.component';
import { ViewTableModalPaymentComponent } from './components/view-more-components/view-table-modal-payment/view-table-modal-payment.component';
import { ViewTableModalMonitoringComponent } from './components/view-more-components/view-table-modal-monitoring/view-table-modal-monitoring.component';
import { ViewTableModalUserAccountComponent } from './components/view-more-components/view-table-modal-user-account/view-table-modal-user-account.component';
import { ViewTableModalFinancialAgreementComponent } from './components/view-more-components/view-table-modal-financial-agreement/view-table-modal-financial-agreement.component';
import { ForgotpasswordComponent } from './components/UI-components/forgotpassword/forgotpassword.component';
import { UserAccountComponent } from './components/main-components/user-account/user-account.component';
import { AssignUserComponent } from './components/administration-component/user-management/assign-user/assign-user.component';
import { ManageLanguageComponent } from './components/main-components/manage-language/manage-language.component';
import { SuggestionAdministrationComponent } from './components/administration-component/suggestion-administration/suggestion-administration.component';
import { TranslationService } from './Service/translation.service';
import { FolderStructureAdminstrationComponent } from './components/administration-component/folder-structure-adminstration/folder-structure-adminstration.component';
import { ViewFolderStructureAdminstrationComponent } from './components/view-components/view-folder-structure-adminstration/view-folder-structure-adminstration.component';
import { ReportAdministrationComponent } from './components/administration-component/report-administration/report-administration.component';
import { EditFolderStructureComponent } from './components/edit-components/edit-folder-structure/edit-folder-structure.component';
import { ViewColumnAccessAdministrationComponent } from './components/administration-component/view-column-access-administration/view-column-access-administration.component';
import { FirstTimeLoginComponent } from './components/UI-components/first-time-login/first-time-login.component';
import { AuthInterceptorInterceptor } from './auth-interceptor.interceptor';
import { PublishAdministrationComponent } from './components/administration-component/publish-administration/publish-administration.component';
import { DeleteMozgisProjectComponent } from './components/delete-mozgis-project/delete-mozgis-project.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { PublishFinancialAgreementComponent } from './components/view-components/publish-financial-agreement/publish-financial-agreement.component';
import { PublishProjectComponent } from './components/view-components/publish-project/publish-project.component';
import { PublishDisbursementComponent } from './components/view-components/publish-disbursement/publish-disbursement.component';
import { PublishIndividualComponent } from './components/view-components/publish-individual/publish-individual.component';
import { PublishMonitoringComponent } from './components/view-components/publish-monitoring/publish-monitoring.component';
import { PublishOrganizationComponent } from './components/view-components/publish-organization/publish-organization.component';
import { PublishPaymentComponent } from './components/view-components/publish-payment/publish-payment.component';
//import {NgxCaptchaModule} from  '@binssoft/ngx-captcha';
//import { CaptchaComponent } from './components/UI-components/captcha/captcha.component';
import { MailSendingAdminstrationComponent } from './components/administration-component/mail-sending-adminstration/mail-sending-adminstration.component';
import { PublishEnvelopeComponent } from './components/view-components/publish-envelope/publish-envelope.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { HttpcancelService } from './httpcancel.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { FeedbackPopupComponent } from './components/dialogbox-components/feedback-popup/feedback-popup.component';
// import { ManageHttpInterceptor } from './interceptors/managehttp.interceptor';
//import { Ng5SliderModule } from 'ng5-slider';
//import { AssignUserComponent } from './components/administraation-component/user-management/assign-user/assign-user.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient,'./assets/i18n/');
}


// import { LanguageMasterNavComponent } from './language-master-nav/language-master-nav.component';

@NgModule({
  declarations: [
    
    AppComponent,
    EnvelopeComponent,
    IndividualComponent,
    OrganizationComponent,
    DisbursementComponent,
    FundingComponent,
    ProjectComponent,
    LeftsidemenuComponent,
    LoginscreenComponent,
    AdminmasterComponent,
    FootersecComponent,
    DashboardComponent,
    DashchartComponent,
    PiechartdashComponent,
    LinechartdashComponent,
    UserAccountComponent,
    PaymentComponent,
    MonitoringComponent,
    // Financing2Component,
    // FundingComponent,
    ViewEnvelopeComponentComponent,
    ViewIndividualComponentComponent,
    ViewOrganizationComponentComponent,
    ViewDisbursementComponentComponent,
    ViewFundingComponentComponent,
    ViewUserAccountComponentComponent,
    ViewPaymentComponentComponent,
    ViewProjectComponentComponent,
    ViewMonitoringComponentComponent,
    DialogBoxComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    AddEnvelopeComponentComponent,
    AddOrganizationComponentComponent,
    EditEnvelopeComponentComponent,

    AlertNotificationComponent,
    AddIndividualComponentComponent,
    AlertNotificationDialogComponent,
    PasswordComponent,
    // DialogboxIndividualComponentsComponent,
    ForgotpasswordComponent,
    DialogboxDisbursmentComponentComponent,
    AddFundingComponent,
    // EditDisbursementComponent,
    AddDisbursementComponent,
    EditDisbursementComponent,
    DialogboxPaymentComponentComponent,
    DialogboxUseraccountComponentComponent,
    AddFundingComponent,
    AddProjectComponentComponent,
    EditFundingComponent,
    EditUserAccountComponentComponent,
    AddUserAccountComponentComponent,
    AddPaymentComponentComponent,
    EditPaymentComponentComponent,
    EditIndividualComponentComponent,
    EditProjectComponent,
    DialogboxIndividualComponentsComponent,
    AccordionComponent,
    EditOrganizationComponentComponent,
    UserTypeComponentComponent,
    AssignGroupComponentComponent,
    UserMappingComponentComponent,
    ManageUserComponentComponent,
    GlobalLinkComponentComponent,
    PrimaryLinkComponentComponent,
    ButtonComponentComponent,
    AddUserTypeComponentComponent,
    ViewUserTypeComponentComponent,
    AddUserMappingComponentComponent,
    ViewUserMappingComponentComponent,
    AddManageUserComponentComponent,
    ViewManageUserComponentComponent,
    CreateGloballinkComponentComponent,
    CreatePrimaryLinkComponentComponent,
    FieldManagementComponent,
    AddMonitoringComponent,
    FunctionMasterComponentComponent,
    ViewFunctionMasterComponentComponent,

    ViewGlobalLinkComponentComponent,
         EditGlobalLinkComponentComponent,
         ViewPrimaryLinkComponentComponent,
         EditMonitoringComponent,
         EditPrimaryLinkComponentComponent,
         EditFunctionMasterComponentComponent,
         ViewTableModalOrganizationComponent,
         ViewTableModalIndividualComponent,
         ViewTableModalEnvelopeComponent,
         ViewTableModalProjectComponent,
         ViewTableModalDisbursmentComponent,
         ViewTableModalPaymentComponent,
         ViewTableModalMonitoringComponent,
         ViewTableModalUserAccountComponent,
         ViewTableModalFinancialAgreementComponent,
         MyLoaderComponent,
         ExchangeRateAdministrationComponent,



         DisbursementDocumentUploadComponent,
         EnvelopeDocumentUploadComponent,
         DisbursementDocumentViewComponent,
         EnvelopeDocumentViewComponent,
         FinancingDocumentUploadComponent,
         ProjectDocumentUploadComponent,
         PaymentDocumentUploadComponent,
         MonitoringDocumentUploadComponent,
         FinancingDocumentViewComponent,
         ProjectDocumentViewComponent,
         PaymentDocumentViewComponent,
         MonitoringDocumentViewComponent,
         AddMonitoringRevisedComponent,
         MonitoringRevisedComponent,
         GlobalLinkComponent,
         PrimaryLinkComponent,
         FunctionMasterComponent,
         SnipPopupComponent,
         AssignUserComponent,
         ManageLanguageComponent,
         SuggestionAdministrationComponent,
         FolderStructureAdminstrationComponent,
         ViewFolderStructureAdminstrationComponent,
         ReportAdministrationComponent,
        
        
         EditFolderStructureComponent,
         ViewColumnAccessAdministrationComponent,
         FirstTimeLoginComponent,
         PublishAdministrationComponent,
         DeleteMozgisProjectComponent,
         PublishFinancialAgreementComponent,
         PublishProjectComponent,
         PublishDisbursementComponent,
         PublishIndividualComponent,
         PublishMonitoringComponent,
         PublishOrganizationComponent,
         PublishPaymentComponent,
         MailSendingAdminstrationComponent,
         PublishEnvelopeComponent,
         FeedbackPopupComponent






    // LanguageMasterNavComponent
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        // useClass: TranslationService,
        deps: [HttpClient]
      }
    }),
    MatChipsModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgbModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatCardModule,
    MatTabsModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatToolbarModule,
    // NoopAnimationsModule,
    MatNativeDateModule,
    MatIconModule,
    MatMenuModule,
    MatSortModule,
    MatTableModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSliderModule,

    MatStepperModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatDialogModule,
    BrowserModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule,HttpClientModule,
    MatRadioModule,
    MatTooltipModule,
    MatSnackBarModule,
    NgxSliderModule,
    MatProgressSpinnerModule,
    NgxCaptchaModule,
    NgIdleKeepaliveModule.forRoot()
    
    


  ],
  entryComponents: [DialogBoxComponent,AlertNotificationDialogComponent,DialogboxIndividualComponentsComponent,
    DialogboxDisbursmentComponentComponent,DialogboxPaymentComponentComponent,DialogboxUseraccountComponentComponent,DisbursementDocumentViewComponent,EnvelopeDocumentUploadComponent,
    FinancingDocumentUploadComponent,ProjectDocumentUploadComponent,PaymentDocumentUploadComponent,MonitoringDocumentUploadComponent,
    EnvelopeDocumentViewComponent,FinancingDocumentViewComponent,PaymentDocumentViewComponent,ProjectDocumentViewComponent,MonitoringDocumentViewComponent],

  providers: [
    HttpcancelService,
    CurrencyPipe,
    {
      provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]
    },
    DecimalPipe,
    {
      provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
    },
    DatePipe,
    LoaderService,
    {
       provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true 
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true
    },
    // {
    //    provide: HTTP_INTERCEPTORS, useClass: ManageHttpInterceptor, multi: true 
    // }
    ],
  bootstrap: [AppComponent]
})
export class AppModule {

 }

 declare module "@angular/core" {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}
