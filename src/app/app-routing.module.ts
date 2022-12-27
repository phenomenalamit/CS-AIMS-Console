import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { EnvelopeComponent } from './components/main-components/envelope/envelope.component';
import { OrganizationComponent } from './components/main-components/organization/organization.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { DataTablesModule } from 'angular-datatables';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { CommonModule } from '@angular/common';
import{ BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
//  import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import{ NoopAnimationsModule} from '@angular/platform-browser/animations';



import { AdminmasterComponent } from './adminmaster/adminmaster.component';

import { FundingComponent } from './components/main-components/funding/funding.component';

import { PaymentComponent } from './components/main-components/payment/payment.component';
import { ProjectComponent } from './components/main-components/project/project.component';
import { MonitoringComponent } from './components/main-components/monitoring/monitoring.component';
import { UserProfileComponent } from './components/main-components/user-profile/user-profile.component';
import { FieldManagementComponent } from './components/administration-component/field-management/field-management.component';

 import { EditEnvelopeComponentComponent } from './components/edit-components/edit-envelope-component/edit-envelope-component.component';
import { EditFundingComponent } from './components/edit-components/edit-funding/edit-funding.component';
import { EditDisbursementComponent } from './components/edit-components/edit-disbursement/edit-disbursement.component';
import { EditUserAccountComponentComponent } from './components/edit-components/edit-user-account-component/edit-user-account-component.component';
import { EditPaymentComponentComponent } from './components/edit-components/edit-payment-component/edit-payment-component.component';
import { EditIndividualComponentComponent } from './components/edit-components/edit-individual-component/edit-individual-component.component';
// import { EditIndividualComponent } from './components/edit-components/edit-individual/edit-individual.component';
import { EditProjectComponent } from './components/edit-components/edit-project/edit-project.component';
import { ViewFundingComponentComponent } from './components/view-components/view-funding-component/view-funding-component.component';
import { EditOrganizationComponentComponent } from './components/edit-components/edit-organization-component/edit-organization-component.component';
import { ViewEnvelopeComponentComponent } from './components/view-components/view-envelope-component/view-envelope-component.component';
import { ViewDisbursementComponentComponent } from './components/view-components/view-disbursement-component/view-disbursement-component.component';
import { ViewProjectComponentComponent } from './components/view-components/view-project-component/view-project-component.component';
import { ViewPaymentComponentComponent } from './components/view-components/view-payment-component/view-payment-component.component';
import { ViewOrganizationComponentComponent } from './components/view-components/view-organization-component/view-organization-component.component';
import { ViewIndividualComponentComponent } from './components/view-components/view-individual-component/view-individual-component.component';
import { ViewUserAccountComponentComponent } from './components/view-components/view-user-account-component/view-user-account-component.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient} from '@angular/common/http';
import { UserTypeComponentComponent } from './components/administration-component/user-management/user-type-component/user-type-component.component';
import { AssignGroupComponentComponent } from './components/administration-component/user-management/assign-group-component/assign-group-component.component';
import { UserMappingComponentComponent } from './components/administration-component/user-management/user-mapping-component/user-mapping-component.component';
import { ManageUserComponentComponent } from './components/administration-component/user-management/manage-user-component/manage-user-component.component';
import { GlobalLinkComponentComponent } from './components/administration-component/link-management/global-link-component/global-link-component.component';
import { PrimaryLinkComponentComponent } from './components/administration-component/link-management/primary-link-component/primary-link-component.component';
import { ButtonComponentComponent } from './components/administration-component/link-management/button-component/button-component.component';
import { ViewMonitoringComponentComponent } from './components/view-components/view-monitoring-component/view-monitoring-component.component';
import { ViewGlobalLinkComponentComponent } from './components/administration-component/link-management/view-global-link-component/view-global-link-component.component';
import { EditMonitoringComponent } from './components/edit-components/edit-monitoring/edit-monitoring.component';
import { ViewPrimaryLinkComponentComponent } from './components/administration-component/link-management/view-primary-link-component/view-primary-link-component.component';
import { EditGlobalLinkComponentComponent } from './components/administration-component/link-management/edit-global-link-component/edit-global-link-component.component';
import { EditPrimaryLinkComponentComponent } from './components/administration-component/link-management/edit-primary-link-component/edit-primary-link-component.component';
import { ViewFunctionMasterComponentComponent } from './components/administration-component/link-management/view-function-master-component/view-function-master-component.component';
import { EditFunctionMasterComponentComponent } from './components/administration-component/link-management/edit-function-master-component/edit-function-master-component.component';
import { ViewTableModalOrganizationComponent } from './components/view-more-components/view-table-modal-organization/view-table-modal-organization.component';
import { ViewTableModalIndividualComponent }from './components/view-more-components/view-table-modal-individual/view-table-modal-individual.component';
import { ViewTableModalEnvelopeComponent } from './components/view-more-components/view-table-modal-envelope/view-table-modal-envelope.component';
import { ViewTableModalProjectComponent } from './components/view-more-components/view-table-modal-project/view-table-modal-project.component';
import { ViewTableModalPaymentComponent } from './components/view-more-components/view-table-modal-payment/view-table-modal-payment.component';
import { ViewTableModalMonitoringComponent } from './components/view-more-components/view-table-modal-monitoring/view-table-modal-monitoring.component';
import { ViewTableModalUserAccountComponent }from './components/view-more-components/view-table-modal-user-account/view-table-modal-user-account.component';
import { ViewTableModalFinancialAgreementComponent } from './components/view-more-components/view-table-modal-financial-agreement/view-table-modal-financial-agreement.component';
import { ExchangeRateAdministrationComponent } from './components/administration-component/exchange-rate-administration/exchange-rate-administration.component';
import { DisbursementDocumentUploadComponent } from './components/document-repository/upload-document/disbursement-document-upload/disbursement-document-upload.component';
import { AddMonitoringRevisedComponent } from './components/add-components/add-monitoring-revised/add-monitoring-revised.component';
import { GlobalLinkComponent } from './components/administration-component/link-management/global-link/global-link.component';
import { PrimaryLinkComponent } from './components/administration-component/link-management/primary-link/primary-link.component';
import { FunctionMasterComponent } from './components/administration-component/link-management/function-master/function-master.component';
import { SnipPopupComponent } from './components/view-more-components/snip-popup/snip-popup.component';
import { DisbursementComponent } from './components/main-components/disbursement/disbursement.component';
import { IndividualComponent } from './components/main-components/individual/individual.component';
import { PasswordComponent } from './components/UI-components/password/password.component';
import { LoginscreenComponent } from './components/UI-components/loginscreen/loginscreen.component';
import { ForgotpasswordComponent } from './components/UI-components/forgotpassword/forgotpassword.component';
import { DashboardComponent } from './components/UI-components/dashboard/dashboard.component';
import { AlertNotificationComponent } from './components/UI-components/alert-notification/alert-notification.component';
import { UserAccountComponent } from './components/main-components/user-account/user-account.component';
import { ViewTableModalDisbursmentComponent } from './components/view-more-components/view-table-modal-disbursment/view-table-modal-disbursment.component';
import { AssignUserComponent } from './components/administration-component/user-management/assign-user/assign-user.component';
import { ManageLanguageComponent } from './components/main-components/manage-language/manage-language.component';
import { SuggestionAdministrationComponent } from './components/administration-component/suggestion-administration/suggestion-administration.component';
import { FolderStructureAdminstrationComponent } from './components/administration-component/folder-structure-adminstration/folder-structure-adminstration.component';
import { ViewFolderStructureAdminstrationComponent } from './components/view-components/view-folder-structure-adminstration/view-folder-structure-adminstration.component';


import { ReportAdministrationComponent } from './components/administration-component/report-administration/report-administration.component';
import { EditFolderStructureComponent } from './components/edit-components/edit-folder-structure/edit-folder-structure.component';
import { ViewColumnAccessAdministrationComponent } from './components/administration-component/view-column-access-administration/view-column-access-administration.component';

import { MonitoringRevisedComponent } from './components/main-components/monitoring-revised/monitoring-revised.component';
import { FirstTimeLoginComponent } from './components/UI-components/first-time-login/first-time-login.component';
import { PublishAdministrationComponent } from './components/administration-component/publish-administration/publish-administration.component';
import { DeleteMozgisProjectComponent } from './components/delete-mozgis-project/delete-mozgis-project.component';
import { PublishFinancialAgreementComponent } from './components/view-components/publish-financial-agreement/publish-financial-agreement.component';
import { PublishProjectComponent } from './components/view-components/publish-project/publish-project.component';
import { PublishDisbursementComponent } from './components/view-components/publish-disbursement/publish-disbursement.component';
import { PublishPaymentComponent } from './components/view-components/publish-payment/publish-payment.component';
import { PublishIndividualComponent } from './components/view-components/publish-individual/publish-individual.component';
import { PublishOrganizationComponent } from './components/view-components/publish-organization/publish-organization.component';
import { PublishMonitoringComponent } from './components/view-components/publish-monitoring/publish-monitoring.component';
import { PublishEnvelopeComponent } from './components/view-components/publish-envelope/publish-envelope.component';
import { MailSendingAdminstrationComponent } from './components/administration-component/mail-sending-adminstration/mail-sending-adminstration.component';
import { FeedbackPopupComponent } from './components/dialogbox-components/feedback-popup/feedback-popup.component';

const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},

  {path:'login', component: LoginscreenComponent},

  {path:'forgotpassword',component:ForgotpasswordComponent},
  {path:'firstTimelogin', component: FirstTimeLoginComponent},

  {path:'admin', component: AdminmasterComponent,
  children:[
 // {path:'firstTimelogin', component: FirstTimeLoginComponent},
  {path:'envelope',component:EnvelopeComponent},
  {path:'view-envelope',component:ViewEnvelopeComponentComponent},
  {path:'edit-envelope/:id',component:EditEnvelopeComponentComponent},
  {path:'view-envelope/:tabId',component:EditEnvelopeComponentComponent},
  {path:'view-drafted-envelope',component:PublishEnvelopeComponent},
  {path:'view-drafted-envelope/:draftedId',component:EditEnvelopeComponentComponent},
  {path:'edit-disbursement/:id',component:EditDisbursementComponent},

  {path:'view-disbursement',component:ViewDisbursementComponentComponent},
  {path:'view-disbursement/:disbursement_id',component:EditDisbursementComponent},
  {path:'view-drafted-disbursement',component:PublishDisbursementComponent},
  {path:'view-drafted-disbursement/:drafted_disbursement_id',component:EditDisbursementComponent},
  {path:'view-payment/:payment_id',component:EditPaymentComponentComponent},
  {path:'edit-payment/:id',component:EditPaymentComponentComponent},
  {path:'view-drafted-payment',component:PublishPaymentComponent},
  {path:'view-drafted-payment/:drafted_payment_id',component:EditPaymentComponentComponent},
  {path:'view-funding',component:ViewFundingComponentComponent},
  {path:'individual',component:IndividualComponent},
  {path:'edit-individual/:id',component:EditIndividualComponentComponent},
  {path:'view-individual',component:ViewIndividualComponentComponent},
  {path:'view-individual/:individualId',component:EditIndividualComponentComponent},
  {path:'view-drafted-individual',component:PublishIndividualComponent},
  {path:'view-drafted-individual/:draftedId',component:EditIndividualComponentComponent},
  {path:'organization',component:OrganizationComponent},
  {path:'disbursement',component:DisbursementComponent},
  {path:'funding',component:FundingComponent},
  {path:'edit-funding/:editFaId',component:EditFundingComponent},
  {path:'view-funding',component:ViewFundingComponentComponent},
  {path:'view-funding/:viewMoreFaId',component:EditFundingComponent},
  {path:'view-more-drafted-fa/:viewMoreDraftdFaId',component:EditFundingComponent},
  {path:'view-drafted-financialAgreement',component:PublishFinancialAgreementComponent},
  {path:'edit-organization/:orgId',component:EditOrganizationComponentComponent},
  {path:'view-organization/:viewId',component:EditOrganizationComponentComponent},
  {path:'view-organization',component:ViewOrganizationComponentComponent},
  {path:'view-drafted-organization',component:PublishOrganizationComponent},
  {path:'view-drafted-organization/:draftedId',component:EditOrganizationComponentComponent},
  {path:'dashboard',component:DashboardComponent},
  // {path:'userAccount',component:UserAccountComponent},
  {path:'edit-user-account',component:EditUserAccountComponentComponent},
  {path:'view-user-account',component:ViewUserAccountComponentComponent},
  {path:'snipPopUp',component:SnipPopupComponent},
  {path:'project',component:ProjectComponent},
  {path:'edit-project/:projectId',component:EditProjectComponent},
  {path:'view-project',component:ViewProjectComponentComponent},
  {path:'view-drafted-project',component:PublishProjectComponent},
  {path:'view-project/:viewProjectId',component:EditProjectComponent},
  {path:'view-drafted-project/:draftedId',component:EditProjectComponent},
  {path:'payment',component:PaymentComponent},
  {path:'view-payment',component:ViewPaymentComponentComponent},
  {path:'feedback-popup',component:FeedbackPopupComponent},
  // {path:'monitoring',component:MonitoringComponent},
  {path:'changePassword',component:PasswordComponent},
  {path:'user-profile',component:UserProfileComponent},
  {path:'alert-notification',component:AlertNotificationComponent},
  {path:'user-type',component:UserTypeComponentComponent},
  // {path:'assign-group',component:AssignUserComponent},
  {path:'user-access-management',component:AssignUserComponent},
  {path:'user-mapping',component:UserMappingComponentComponent},
  {path:'user-account',component:ManageUserComponentComponent},
  {path:'global-link',component:GlobalLinkComponent},
  {path:'view-global-link',component:ViewGlobalLinkComponentComponent},
  {path:'primary-link',component:PrimaryLinkComponent},
  {path:'view-primary-link',component:ViewPrimaryLinkComponentComponent},
  {path:'function-master',component:FunctionMasterComponent},
  {path:'view-function-master',component:ViewFunctionMasterComponentComponent},
  {path:'button',component:ButtonComponentComponent},
  {path:'view-monitoring',component:ViewMonitoringComponentComponent},
  {path:'field-management',component:FieldManagementComponent},
  {path:'edit-monitoring/:monitoringId',component:EditMonitoringComponent},
  {path:'view-monitoring/:contractId',component:EditMonitoringComponent},
  {path:'view-drafted-monitoring',component:PublishMonitoringComponent},

  {path:'view-table-modal-Organization-Component',component:ViewTableModalOrganizationComponent},
  {path:'view-table-modal-Individual-Component',component:ViewTableModalIndividualComponent},
  {path:'view-table-modal-Envelope-Component',component:ViewTableModalEnvelopeComponent},
  {path:'view-table-modal-Project-Component',component:ViewTableModalProjectComponent},
  {path:'view-table-modal-Disbursment-Component/:id',component:ViewTableModalDisbursmentComponent},
  {path:'view-table-modal-Payment-Component',component:ViewTableModalPaymentComponent},
  {path:'view-table-modal-Monitoring-Component',component:ViewTableModalMonitoringComponent},
  {path:'view-table-modal-User-Account-Component',component:ViewTableModalUserAccountComponent},
  {path:'view-table-modal-Financial-Agreement-Component',component:ViewTableModalFinancialAgreementComponent},


  {path:'update-globalLink/:id',component:EditGlobalLinkComponentComponent},
  {path:'update-primaryLink/:id',component:EditPrimaryLinkComponentComponent},

  {path:'update-functionMaster/:id',component:EditFunctionMasterComponentComponent},
  {path:'exchange-rate-administartion',component:ExchangeRateAdministrationComponent},
  {path:'publish-administration',component:PublishAdministrationComponent},


  {path:'disbursement-upload-document',component:DisbursementDocumentUploadComponent},
  {path:'monitoring',component:MonitoringRevisedComponent},
  {path:'manage-language',component:ManageLanguageComponent},
  {path:'suggestion-administartion',component:SuggestionAdministrationComponent},
  {path:'folder-structure-administartion',component:FolderStructureAdminstrationComponent},


  // {path:'view-column-access-component',component:ViewColumnAccessComponentComponent},

  {path:'view-folder-structure-administartion',component:ViewFolderStructureAdminstrationComponent},
  {path:'edit-folder-structure-administartion/:editId',component:EditFolderStructureComponent},
  {path:'view-folder-structure-administartion/:viewId',component:EditFolderStructureComponent},
  {path:'report-administration',component:ReportAdministrationComponent},
  {path:'view-column-access',component:ViewColumnAccessAdministrationComponent},
  {path:'delete-mozgis-component',component:DeleteMozgisProjectComponent},

  {path:'bulk-mail-adminstration',component:MailSendingAdminstrationComponent},

  { path: '**', component: LoginscreenComponent }
  ]}



];
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient,'./assets/i18n/');
}

@NgModule({
  imports: [
    RouterModule.forRoot(routes,{ useHash: true }),
    BrowserModule

  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  exports: [RouterModule,

  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  DataTablesModule,
  MatTableModule,
  CommonModule,
  BrowserModule,
  BrowserAnimationsModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatGridListModule,
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

]
})
export class AppRoutingModule {


}
