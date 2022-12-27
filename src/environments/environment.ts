// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  projectURL:"http://localhost:8080/api/getProjectDetails",
  getPmtProjectTitleDetailsByUserAccessId:"http://localhost:8080/api/getPmtProjectTitleDetailsByUserAccessId",
  onBudgetProjectURL:"http://localhost:8080/api/getOnBudgetProjectDetails",
  currencyURL:"http://localhost:8080/api/getCurrencyDetails",
  fundingOrganizationURL:"http://localhost:8080/api/getFundingOrganizationDetails",
  moduleListURL:"http://localhost:8080/api/getModuleListDetails",
  PurposeDacCrsURL:"http://localhost:8080/api/getPurposeCodesDetails",
  districtURL:"http://localhost:8080/api/getDistrictsDetailsUnderprovincesId",
  purposeDacCrsFiveURL:"http://localhost:8080/api/getPurposeCodesFiveDigitDetails",
  purposeDacCrsThreeURL:"http://localhost:8080/api/getPurposeCodesThreeDigitDetails",
  getAllDistrictURL:"http://localhost:8080/api/getDistrictsDetails",
  donorURL:"http://localhost:8080/api/getDonorDetails",
  getdonorFundingURL:"http://localhost:8080/api/getDonorList",
  getDonorListByUserAccess:"http://localhost:8080/api/getDonorListByUserAccess",
  stateBudgetURL:"http://localhost:8080/api/getStateBudgetDetails",
  iatiLocationURL:"http://localhost:8080/api/getIatiLocationDetails",
  implementingOrganizationURL:"http://localhost:8080/api/getImplementingOrganizationDetails",
  constraintURL:"http://localhost:8080/api/getConstraintDetails",
  levelOfActionUrl:"http://localhost:8080/api/getLevelOfActionDetails",
  reasonForAddendumUrl:"http://localhost:8080/api/getReasonForAddendumDetails",
  recommendationURL:"http://localhost:8080/api/getRecommendationDetails",
  findingURL:"http://localhost:8080/api/getFindingDetails",
  optionFindingURL:"http://localhost:8080/api/getOptionFindingUnderFindingId",
  organizationURL:"http://localhost:8080/api/organizationIndividualURL",
  provincesURL:"http://localhost:8080/api/getProvincesDetails",
  responsibleOrganizationURL:"http://localhost:8080/api/getResponsibleOrganizationDetails",
  typeOfUserURL:"http://localhost:8080/api/getTypeOfUserDetails",
  userGroupURL:"http://localhost:8080/api/getUserGroupDetails",
  permissionsURL:"http://localhost:8080/api/getPermissionsDetails",
  operationsURL:"http://localhost:8080/api/getOperationsDetails",
  featuresURL:"http://localhost:8080/api/getFeaturesDetails",
  currencyAmountURL:"http://localhost:8080/api/getCurrencyAmount",
  currencyJsonURL:"http://localhost:8080/api/getCurrencyJson",
  countryURL:"http://localhost:8080/api/getCountryDetails",
  financingAgreementURL:"http://localhost:8080/api/getFinancingAgreementDetails",
  projectTitleURL:"http://localhost:8080/api/getProjectTitleDetails",
  getProjectTitleDetailsByUserAccessId:"http://localhost:8080/api/getProjectTitleDetailsByUserAccessId",
  projectSituationURL:"http://localhost:8080/api/getprojectSituationDetails",
  fundingTitleURL:"http://localhost:8080/api/getFundingTitelDetails",
  fundingTitleByPrjIdURL:"http://localhost:8080/api/getFundingTitelDetailsNyPrjId",
  financingSituationURL:"http://localhost:8080/api/getFinancingSituationDetails",
  OrganizationCategoryURL:"http://localhost:8080/api/getCategoryDetails",
  OrganizationCityURL:"http://localhost:8080/api/getCityDetails",
  sustainableDevelopmentGoal: "http://localhost:8080/api/getSustainableDevelopmentGoalDetails",
  sustainableDevelopmentTarget: "http://localhost:8080/api/getSustainableDelopmentTargetDetailsUnderGoalId",
  aidDacCrsURL: "http://localhost:8080/api/getTDacCrsDetails",
  typeOfImplementationURL: "http://localhost:8080/api/getTypeOfImplementationDetails",
  typeOfFinanceURL: "http://localhost:8080/api/getTypeOfFinanceDetails",
  meoResourceSourceURL: "http://localhost:8080/api/getMeoResourceSourceDetails",
  pillarPqgMeoURL: "http://localhost:8080/api/getPillarPqgMeoDetails",
  listOfAssociatedFundingURL: "http://localhost:8080/api/getSelectListOfAssociatedFundingDetails",
  // StrategicPqgMeoURL:"http://localhost:8080/api/getStrategicObjPqgMeoUnderpillar",
  StrategicPqgMeoURL: "http://localhost:8080/api/getStrategicObjPqgMeoDetails",
  StrategicPqgMeoByPillarIdURL: "http://localhost:8080/api/getStrategicObjPqgMeoDetailsByPillarPqgId",
  countryDialingCodeURl: "http://localhost:8080/api/getCountryDialingCodeDetails",
  organizationCrudSaveUrl: "http://localhost:8080/api/saveOrganizationCrudDetails",
  organizationCrudGetUrl: "http://localhost:8080/api/getOrganizationCrudDetails",
  countryOrParentOrganizationURL: "http://localhost:8080/api/countryOrParentOrganizationURL",
  fundingOrgURL: "http://localhost:8080/api/getFundingOrg",
  fundingOrgDetailsURL:"http://localhost:8080/api/getFundingOrgDetails",
  getFundingOrgDetailsByUserAccessId:"http://localhost:8080/api/getFundingOrgDetailsByUserAccessId",
  organizationGetByIdURL: "http://localhost:8080/api/organizationGetByIdURL",
  organizationEditById: "http://localhost:8080/api/organizationEditById",
  deleteOrganizationCrudDetailsById: "http://localhost:8080/api/deleteOrganizationCrudDetailsById",
  updateOrganizationCrudDetailsById: "http://localhost:8080/api/updateOrganizationCrudDetailsById",
  organizationExcelUrl: "http://localhost:8080/api/download/downloadOrganizationExcel/",
  organizationDraftSaveUrl: "http://localhost:8080/api/organizationSaveAsDraftUrl",
  getOrganizationDraftViewListURL: "http://localhost:8080/api/getOrganizationDraftViewList",
  patchOrganizationDraftValueURL: "http://localhost:8080/api/getOrganizationDraftById",
  getMarkerMasterURL:"http://localhost:8080/api/getMarkerMasterDetails",
  draftedorganizationCrudGetUrl: "http://localhost:8080/api/getDraftedOrganizationDetails",
  publishOrganizationById: "http://localhost:8080/api/publishOrganizationById",
  discardOrganizationById: "http://localhost:8080/api/discardOrganizationById",
  

  individualCrudSaveUrl: "http://localhost:8080/api/saveIndividualCrudDetails",
  individualSaveAsDraftUrl: "http://localhost:8080/api/individualSaveAsDraftUrl",
  getIndividualDraftViewListURL: "http://localhost:8080/api/getIndividualDraftViewList",
  patchIndividualDraftValueURL: "http://localhost:8080/api/getIndividualDraftById",
  individualCrudGetUrl: "http://localhost:8080/api/getIndividualCrudDetails",
  individualViewMoreByIdURL: "http://localhost:8080/api/individualGetByIdURL",
  individualGetByIdURL: "http://localhost:8080/api/getIndividualDraftById",
  individualEditById: "http://localhost:8080/api/individualEditById",
  checkDuplicateMailIndividual:"http://localhost:8080/api/checkDuplicateMailIndividual",
  checkDuplicateIndividual: "http://localhost:8080/api/checkDuplicateIndividual",
  updateIndividualCrudDetailsById: "http://localhost:8080/api/updateIndividualCrudDetailsById",
  deleteIndividualCrudDetailsById: "http://localhost:8080/api/deleteIndividualCrudDetailsById",
  deleteIndividualCrudDetailsByIds: "http://localhost:8080/api/deleteIndividualCrudDetailsByIds",
  findProjectIndividualOrgByIndividualIds:"http://localhost:8080/api/findProjectIndividualOrgByIndividualIds",
  individualExcelUrl: "http://localhost:8080/api/download/downloadIndividualExcel/",
  fundingOrganizationByDonorURL: "http://localhost:8080/api/getFundingOrganizationDetailsFromDonorName",
  fundingOrganizationByDonorIdURL: "http://localhost:8080/api/getFundingOrganizationList",
  getFinanceAllocationURL: "http://localhost:8080/api/getFiananceCurrency",
  getYearWiseCurrencyURL: "http://localhost:8080/api/getYearWiseCurrency",
  getOdaAmountURL: "http://localhost:8080/api/getOdaCurrencyJson",
  donorByFundingOrgURL: "http://localhost:8080/api/getDonorDetailsFromFundingOrg",
  countryCodeByCountryNameURL: "http://localhost:8080/api/getCountryCodeFromCountry",
  getMznFromUSD: "http://localhost:8080/api/getMznFromUsd",
  userAccessObjectURL: "http://localhost:8080/api/getUserAccessObjectById",
  getUserTypeList: "http://localhost:8080/api/getUserTypeList",
  saveUserAccess: "http://localhost:8080/api/saveUserAccess",
  updateUserAccess: "http://localhost:8080/api/updateUserAccess",
  getUserAccessDetailsById: "http://localhost:8080/api/getUserAccessDetailsById",
  changeUserAccessStatus: "http://localhost:8080/api/changeUserAccessStatus",
  getUserAccessDetails: "http://localhost:8080/api/getUserAccessDetails",
  checkUserNameDuplicateValues: "http://localhost:8080/api/checkDuplicateUserName",
  getUserDetailsByuserName: "http://localhost:8080/api/getUserDetailsByUserName",
  checkEmailDuplicateValues: "http://localhost:8080/api/checkDuplicateEmail",
  userTypeSaveURl: "http://localhost:8080/api/saveUserTypeDetails",
  saveUserAssignGroup: "http://localhost:8080/api/saveUserAssignGroup",
  checkUserTypeNameURl: "http://localhost:8080/api/checkUserTypeDetailsByUserTypeName",
  getUserTypeURl: "http://localhost:8080/api/getUserTypeDetails",
  getUserTypeByIdURl: "http://localhost:8080/api/getUserTypeDetailsById",
  updateUserTypeSaveURl: "http://localhost:8080/api/updateUserTypeDetails",
  changeUserTypeStatusByIdURl: "http://localhost:8080/api/updateUserTypeStatus",
  userMappingSaveURl: "http://localhost:8080/api/saveUserMappingDetails",
  userMappingDuplicateUserURl: "http://localhost:8080/api/checkUserMappingDetails",
  getUserMappingURl: "http://localhost:8080/api/getUserMappingDetails",
  getUserMappingByIdURl: "http://localhost:8080/api/getUserMappingDetailsById",
  getUserTypeIdURl: "http://localhost:8080/api/getUserTypeById",
  getUserTypeByUserAccessURl: "http://localhost:8080/api/getUserTypeDetailsForUserAccessById",
  changeUserMappingStatusByIdURl: "http://localhost:8080/api/updateUserMappingStatusById",
  userMappingUpdateURl: "http://localhost:8080/api/updateUserMappingDetails",
  UserAccountDetailsURl: "http://localhost:8080/api/getUserAccountsUserNameDetails",
  userAccessSaveURl: "http://localhost:8080/api/saveUserAccessDetails",
  getUserAccessDetailsURl: "http://localhost:8080/api/getUserAccessDetails",
  getUserAccessDetailsToGetUserNmAndEmail: "http://localhost:8080/api/getUserAccessAllDetails/getUserAccessDetailsToGetUserNmAndEmail",
  getUserAccessDetailsEmailURl:"http://localhost:8080/api/getUserAccessEmailDetails",
  getUserAccessByIdURl: "http://localhost:8080/api/getUserAccessDetailsById",
  changeUserAccessStatusByIdURl: "http://localhost:8080/api/updateUserAccessStatusById",
  changeUserAccessStatusByUserNameURl: "http://localhost:8080/api/updateUserAccessStatusById",
  userAccessUpdateURl: "http://localhost:8080/api/updateUserAccessDetails",
  updateUserAccessProfilePicture: "http://localhost:8080/api/updateUserAccessProfilePicture",
  getOdaAmountUsdURL: "http://localhost:8080/api/getOdaCurrencyUsdJson",
  getOdaAmountMznURL: "http://localhost:8080/api/getOdaCurrencyMznJson",
  // individualCrudGetUrl:""
  // organizationCrudGetUrl:""
  // StrategicPqgMeoURL:"http://localhost:8080/api/getStrategicObjPqgMeoUnderpillar",
  // countryDialingCodeURl:"http://localhost:8080/api/getCountryDialingCodeDetails",
  // cityMasterDataUrl:"http://localhost:8080/api/getCityDetail .

  /**Disbursement Crud Integration URL(s) Starts from here*/
  disbursementSaveUrl: "http://localhost:8080/api/saveDisbursementDetails",
  disbursementUpdateUrl: "http://localhost:8080/api/updateDisbursementById",
  disbursementViewListURL: "http://localhost:8080/api/getDisbursementViewList",
  disbursementAllViewListURL: "http://localhost:8080/api/getDisbursementAllViewList",
  disbursementViewMoreByIdURL: "http://localhost:8080/api/getDisbursementViewMoreById",
  editDisbursementByIdURL: "http://localhost:8080/api/getEditDisbursementById",
  deleteByIdURL: "http://localhost:8080/api/deleteDisbursementById",
  deleteByIdsURL: "http://localhost:8080/api/deleteDisbursementByIds",
  getDuplicateReferenceURL: "http://localhost:8080/api/getDuplicateReference",
  disbursementDraftSaveUrl: "http://localhost:8080/api/saveDisbursementDraftDetails",
  getDisbursementDraftViewListURL: "http://localhost:8080/api/getDisbursementDraftViewList",
  disbursemntExcelUrl: "http://localhost:8080/api/download/downloadDisbursementExcel/",
  patchDisbursemntDraftValueURL: "http://localhost:8080/api/getDisbursementDraftById",
  disbursementViewListByFaIdURL: "http://localhost:8080/api/getDisbursementViewListByFaId",
  publishDisbursementByIdURL: "http://localhost:8080/api/publishDisbursementById",
  discardDisbursementByIdURL: "http://localhost:8080/api/discardDisbursementById",
  draftedDisbursementViewListURL: "http://localhost:8080/api/getDraftedDisbursementViewList",
  fundingOrganizationByFundIdURL:"http://localhost:8080/api/fundingOrganizationByFundIdURL",
  fundingOrganizationByProjectIdURL:"http://localhost:8080/api/fundingOrganizationByProjectIdURL",
  /**Disbursement Crud Integration URL(s) Ends here*/

  /**Payment Crud Integration URL(s) Starts from here*/
  paymentSaveUrl: "http://localhost:8080/api/savePaymentDetails",
  paymentViewListURL: "http://localhost:8080/api/getPaymentViewList",
  paymentViewListAllURL: "http://localhost:8080/api/getPaymentAllViewList",
  paymentExcelUrl: "http://localhost:8080/api/download/downloadPaymentExcel/",
  paymentViewMoreByIdURL: "http://localhost:8080/api/getPaymentViewMoreById",
  deletePaymentByIdURL: "http://localhost:8080/api/deletePaymentById",
  deletePaymentByIdsURL: "http://localhost:8080/api/deletePaymentByIds",
  editPaymentByIdURL: "http://localhost:8080/api/getEditPaymentById",
  paymentUpdateUrl: "http://localhost:8080/api/updatePaymentById",
  getPaymentDraftViewListURL: "http://localhost:8080/api/getPaymentDraftViewList",
  patchPaymentDraftValueURL: "http://localhost:8080/api/getPaymentDraftById",
  paymentDraftSaveUrl: "http://localhost:8080/api/savePaymentDraftDetails",
  paymentViewListByFaIdURL: "http://localhost:8080/api/getPaymentViewListByFaId",
  draftedPaymentList: "http://localhost:8080/api/getDraftedPaymentViewList",
  publishPaymentByIdURL: "http://localhost:8080/api/publishPaymentById",
  discardPaymentByIdURL: "http://localhost:8080/api/discardPaymentById",
  checkDuplicatePaymentRefURL: "http://localhost:8080/api/checkDuplicatePaymentReference",
  mEXURL:"http://localhost:8080/api/mexDetails",
  /**Payment Crud Integration URL(s) Ends here*/

  // Envelope Url Start
  financialUrl:"http://localhost:8080/api/getFinancialDetails",
  envelopeUrl:"http://localhost:8080/api/saveEnvelope",
  envelopeDetailsUrl:"http://localhost:8080/api/fetchEnevelopDetails",
  envelopeDetailsAllUrl:"http://localhost:8080/api/getEnevelopDetails",
  draftedEnvelopeDetailsUrl:"http://localhost:8080/api/fetchDraftedEnevelopDetails",
  deleteEnvelopeUrlById:"http://localhost:8080/api/deleteByIds",
  envelopeRefDetailsUrl:"http://localhost:8080/api/getEnvelopeRefDetails",
  editEnvelopeUrl:"http://localhost:8080/api/getEnvelopeDetailsById",
  viewMoreUrl:"http://localhost:8080/api/getEnvelopeDetailsByTabId",
  deleteEnvelopeUrl:"http://localhost:8080/api/deleteById",
  envelopeSaveAsDrftUrl:"http://localhost:8080/api/saveAsDraftEnvelope",
  envelopeSaveAsDraftDetailsUrl:"http://localhost:8080/api/fetchSaveASDraftEnevelopDetails",
  setSaveAsDraftUrl:"http://localhost:8080/api/getsaveAsDetailsById",
  getPermissionDetailsUrl:"http://localhost:8080/api/getPermissionsDetails",
  commonUrl:"http://localhost:8080/",
  loginUserUrl:"http://localhost:8080/api/login",
  envelopeExcelUrl:"http://localhost:8080/api/download/downloadEnvelopDetails/",
  envelopeDocDetailsByRefNmUrl:"http://localhost:8080/api/viewEnvelopeDocumentByrefNm",
  envelopeDocUrl:"http://localhost:8080/api/saveEnvelopeDoc",
  envelopeDocDetailsUrl:"http://localhost:8080/api/viewEnvelopeDocument",
  envelopeDocDownloadrl:"http://localhost:8080/api/download/downloadEnvelopeDocuments/",
  envelopeReferenceListURL:"http://localhost:8080/api/getEnvelopeReferenceByDonorIdAndFundingOrganizationId",
  envelopeDocDeleteByIdUrl:"http://localhost:8080/api/envelopeDocDeleteByIdUrl",
  getExchangeRateEenvelopeURL:"http://localhost:8080/api/getEnvelopeExchangeRate",
  getEmailOfUser:"http://localhost:8080/api/getEmailOfUser",
 

  // Envelope Url End

/* MonitoringCrud Url Strat */
monitoringSaveUrl:"http://localhost:8080/api/saveMonitoring",
monitoringDetailsUrl:"http://localhost:8080/api/fetchMonitoringDetails",
monitoringAllDetailsUrl:"http://localhost:8080/api/getMonitoringDetails",
monitoringExcelUrl:"http://localhost:8080/api/download/downloadMonitoringDetails/",
deleteMonitoringUrl:"http://localhost:8080/api/deleteByMonitoingContractId",
viewMoreMonitoringUrl:"http://localhost:8080/api/getDetailsByContractId",
editMonitoringUrl:"http://localhost:8080/api/getDetailsByMonitoringId",
monitoringDocDeleteByIdUrl:"http://localhost:8080/api/monitoringDocDeleteByIdUrl",

monitoringSaveDraftUrl:"http://localhost:8080/api/saveDraftMonitoring",
monitoringSaveAsDraftDetailsUrl:"http://localhost:8080/api/fetchSaveASDraftMonitoringDetails",
getDraftByIdUrl:"http://localhost:8080/api/getDraftDetailByMonitoringId",
/* MonitoringCrud Url End */

/* Folder Structure url start */
foderStrSaveUrl:"http://localhost:8080/api/saveFolderStructure",
folderStrDetailsUrl:"http://localhost:8080/api/fetchFolderStrDetails",
editfolderStrIdUrl:"http://localhost:8080/api/getFolderStrDetailsById",
deleteFolderStrUrl:"http://localhost:8080/api/deleteByFolderStrId",
/* Folder Structure url end */

/* Financing Document url Start */
finnancialDocUrl:"http://localhost:8080/api/saveFinancialDoc",
financingDocDetailsUrl:"http://localhost:8080/api/viewFinancingDocument",
financingDocDownloadrl:"http://localhost:8080/api/download/downloadFinancingDocuments/",
financingDocDetailsByRefNmUrl:"http://localhost:8080/api/viewFinancingDocumentByRefNm",

/* Financing Document url End */

/* Project Document url Start */
projectDocUrl:"http://localhost:8080/api/saveProjectDoc",
projectDocDetailsUrl:"http://localhost:8080/api/viewProjectDocument",
projectDocDownloadrl:"http://localhost:8080/api/download/downloadProjectDocuments/",
projectDocDeleteByIdUrl:"http://localhost:8080/api/projectDocDeleteByIdUrl",
prjDocDetailsByIdUrl:"http://localhost:8080/api/projectDocumentsById",
/* Project Document url End */

/* Disbursment Document url Start */
disbursmentDocUrl:"http://localhost:8080/api/saveDisbursmentDoc",
disbursmentDocDetailsUrl:"http://localhost:8080/api/viewDisbursmentDocument",
disbursmentDocDownloadrl:"http://localhost:8080/api/download/downloadDisbursmentDocuments/",
disbursementDocDeleteByIdUrl : "http://localhost:8080/api/disbursementDocDeleteByIdUrl",
/* Disbursment Document url End */

/* Payment Document url Start */
paymentDocUrl:"http://localhost:8080/api/savePaymentDoc",
 paymentDocDetailsUrl:"http://localhost:8080/api/viewPaymentDocument",
 paymentDocDownloadrl:"http://localhost:8080/api/download/downloadPaymentDocuments/",
 paymentDocDeleteByIdUrl:"http://localhost:8080/api/paymentDocDeleteByIdUrl",
disbursmentDocDetailsByRefNmUrl:"http://localhost:8080/api/viewDisbursmentDocumentByRefNm",

/* Disbursment Document url End */

/* Payment Document url Start */
 paymentDocDetailsByRefNmUrl:"http://localhost:8080/api/viewPaymentDocumentByRefNm",
/* Payment Document url End */

/* Monitoring Document url Start */
monitoringDocUrl:"http://localhost:8080/api/saveMonitoringDoc",
monitoringDocDetailsUrl:"http://localhost:8080/api/viewMonitoringDocument",
monitoringDocDetailsByBudgetPrjUrl:"http://localhost:8080/api/viewMonitoringDocumentByBudgetPrj",
monitoringDocDownloadrl:"http://localhost:8080/api/download/downloadMonitoringDocuments/",
/* Monitoring Document url End */

// Feild Management Start
saveNewElementURL:"http://localhost:8080/api/addCode",
//Field Management End

//ExchangeRate Start
getAllExchangeRateURL:"http://localhost:8080/api/getAllExchangeRate",
saveExchangeURL :"http://localhost:8080/api/saveExchangeRate",
deleteExchangeRateURL :"http://localhost:8080/api/deleteExchangeRate",
getExchangeRateURL:"http://localhost:8080/api/getFianancialAgreementExchangeRate",
filterExchangeRate:"http://localhost:8080/api/filterExchangeRate",
//Exchange Rate End

//Notification alert start
saveNotificationTableDetails:"http://localhost:8080/api/saveNotificationTableDetails",
getNotificationTableDetails:"http://localhost:8080/api/getNotificationTableDetails",
checkPasswordExpireAlert:"http://localhost:8080/api/checkPasswordExpireAlert",
checkFinancialAgreementOngoing:"http://localhost:8080/api/checkFinancialAgreementOngoing",
checkFinancialAgreementEntersTheFinalYear:"http://localhost:8080/api/checkFinancialAgreementEntersTheFinalYear",
checkProjectOngoing:"http://localhost:8080/api/checkProjectOngoing",
projectWithNoUpdates:"http://localhost:8080/api/projectWithNoUpdates",
financialAgreementWithNoUpdates:"http://localhost:8080/api/financialAgreementWithNoUpdates",
checkDisbursementFinancingSituation:"http://localhost:8080/api/checkDisbursementFinancingSituation",
findRestFundingAmountAfterDisbursed:"http://localhost:8080/api/findRestFundingAmountAfterDisbursed",
findRestDisbursedAmountAfterPayment:"http://localhost:8080/api/findRestDisbursedAmountAfterPayment",
//Notification alert end

//Financial Agreement
getFinancialAgreementById:"http://localhost:8080/api/getFinancialAgreementById",
getFinancialAgreementForEditById:"http://localhost:8080/api/getFinancialAgreementForEditById",
getFASaveAsDraftList:"http://localhost:8080/api/getSaveAsDraftFinancialAgreement",
getFinancialAgreementFromDraftForEditById:"http://localhost:8080/api/getFinancialAgreementFromDraftForEditById",
checkDuplicateFundingDonorTitleURL:"http://localhost:8080/api/checkDuplicateDonorTitle",
checkDuplicateFundingDonorTitleOnUpdateURL:"http://localhost:8080/api/checkDuplicateDonorTitleOnUpdate",
checkDuplicateFundingDonorReferenceURL:"http://localhost:8080/api/checkDuplicateDonorReference",
checkDuplicateFundingDonorReferenceOnUpdateURL:"http://localhost:8080/api/checkDuplicateDonorReferenceOnUpdate",
getEnvelopeDetailsByEnvelopeRefURL:"http://localhost:8080/api/getEnvelopeDetailsFromEnvelopeReference",
publishFinancialAgreement:"http://localhost:8080/api/publishFinancialAgreement",
discardFinancialAgreement:"http://localhost:8080/api/discardFinancialAgreement",
downloadFinancialAgreementDetailsExcel:"http://localhost:8080/api/download/downloadFinancialAgreementDetailsExcel/",
deleteFA : "http://localhost:8080/api/deactivateFinancialAgreementById",
deleteFAIds : "http://localhost:8080/api/deactivateFinancialAgreement",
financeDocDeleteByIdUrl : "http://localhost:8080/api/financeDocDeleteByIdUrl",

/* ReportAdministration URL(s) Starts from here. */
getAllReportsURL:"http://localhost:8080/api/getAllReports",
saveReportURL:"http://localhost:8080/api/saveAllReports",
deleteReportURL:"http://localhost:8080/api/deleteReports",

/* ReportAdministration URL(s) Ends here. */

/* View Column access URL(s) Starts from here.*/

getCloumnAccessByUserURL:"http://localhost:8080/api/viewColumnAccessGetByIdURL",

//primaryLink services
savePrimaryLinkURL:"http://localhost:8080/api/registerPrimaryLink",
updatePrimaryLinkURL:"http://localhost:8080/api/updatePrimaryLinkDetails",
getPrimaryLinkURL:"http://localhost:8080/api/getPrimaryLinkDetails",
getPrimaryLinkByIdURL:"http://localhost:8080/api/getPrimaryLinkDetailsById",
getPrimaryLinkURLWithStatusActive:"http://localhost:8080/api/getPrimaryLinkDetailsWithStatusActive",
getPrimaryLinkDetailsWithPermission:"http://localhost:8080/api/getPrimaryLinkDetailsWithPermission",
checkPrimaryLinkName:"http://localhost:8080/api/checkPrimaryLinkDetailsByPrimaryLinkName",
primaryLinkExcelUrl:"http://localhost:8080/api/download/downloadPrimaryLinkExcelDetails",
filterPrimaryLink:"http://localhost:8080/api/filterPrimaryLink",

//functionMaster service
getFunctionMasterURL:"http://localhost:8080/api/getFunctionMasterDetails",
getFunctionMasterDetailsForPLinkByOrder:"http://localhost:8080/api/getFunctionMasterDetailsForPLinkByOrder",
saveFunctionMasterURL:"http://localhost:8080/api/registerFunctionMaster",
getFunctionMasterByIdURL:"http://localhost:8080/api/getFunctionMasterDetailsById",
updateFunctionMasterURL:"http://localhost:8080/api/updateFunctionMasterDetails",
checkDuplicateFunctionMasterURL:"http://localhost:8080/api/checkDuplicateFunctionMasterURL",
functionMasterExcelUrl:"http://localhost:8080/api/download/downloadFunctionMasterExcelDetails",
filterfunctionMaster:"http://localhost:8080/api/filterfunctionMaster",

//Srart globallink URL
saveGlobalLinkURL: "http://localhost:8080/api/registerGlobalLink",
updateGlobalLinkURL: "http://localhost:8080/api/updateGlobalLinkDetails",
getGlobalLinkURL: "http://localhost:8080/api/getGlobalLinkDetails",
getAllGlobalLinkForPrimaryByOrder:"http://localhost:8080/api/getAllGlobalLinkForPrimaryByOrder",
getGlobalLinkByIdURL: "http://localhost:8080/api/getGlobalLinkDetailsById",
checkDuplicateGlobalLinkURL: "http://localhost:8080/api/checkDuplicateGlobalLinkName",
globalLinkExcelUrl:"http://localhost:8080/api/download/downloadGlobalLinkExcelDetails",
filterGlobalLink:"http://localhost:8080/api/filterGlobalLink",
//End GlobalLink URL

//translate service
translationServiceURL:"http://localhost:8080/api/getLabelsByLanguage/",

//financingServiceService
 saveFinancingServiceServiceURL:"http://localhost:8080/api/addFinancialAgreement",
 saveFinancialAgreementLocationURL:"http://localhost:8080/api/addFinancialAgreementLocation",
 updateFinancialAgreementURL:"http://localhost:8080/api/updateFinancialAgreement",
 getFinancingServiceServiceAllFAURL:"http://localhost:8080/api/getFinancialAgreementDetails",
 getFinancingServiceServiceAllURL:"http://localhost:8080/api/getFinancialAgreementAllDetails",
// getFinancingServiceServiceAllFAURL:"http://localhost:8080/getFinancialAgreementDetails",
 saveAsDraftFinancingServiceURL:"http://localhost:8080/api/addSaveAsDraftFinancialAgreement",
 getDraftedFinancialAgreementList:"http://localhost:8080/api/getDraftedFinancialAgreement",
 
 
 getProvinceList:"http://localhost:8080/api/getProvinceList",
 getDistrictList:"http://localhost:8080/api/getDistrictList",

//ManageLanguageService
getManageLanguageServiceAllGlobalLink:"http://localhost:8080/api/getAllGlobalLink",
getManageLanguageServicePrimaryLink:"http://localhost:8080/api/getPrimaryLink/",
getManageLanguageServiceLabelData:"http://localhost:8080/api/getLabelData/",
updateManageLanguageServiceLabelValue:"http://localhost:8080/api/updateLabelValue",


/* View Column access URL(s) Ends here. */

changePassword:"http://localhost:8080/api/updateChangePassword",
firstTimeloginUserUrl:"http://localhost:8080/api/firstTimelogin",
resetFirstTimeLoginUserPassword:"http://localhost:8080/api/resetFirstTimeLoginUserPassword",

//Project crud urls start
saveProjectURL:"http://localhost:8080/api/saveProjectDetails",
getProjectViewList:"http://localhost:8080/api/getProjectViewList",
getProjectAllViewList:"http://localhost:8080/api/getProjectAllViewList",
individualDropdownURL:"http://localhost:8080/api/individualDropdownURL",
deleteProjectById:"http://localhost:8080/api/deleteProjectById",
deleteProjectByIds:"http://localhost:8080/api/deleteProjectByIds",
deleteProjectFromMozgisById:"http://localhost:8080/api/deleteProjectFromMozgisId",
getProjectById:"http://localhost:8080/api/getProjectById",
updateProjectById:"http://localhost:8080/api/updateProjectById",
saveAsDraftProjectDetails:"http://localhost:8080/api/saveAsDraftProjectDetails",
getProjectDraftDataViewList:"http://localhost:8080/api/getProjectDraftDataViewList",
getProjectDraftById:"http://localhost:8080/api/getProjectDraftById",
updateSaveAsDraftProjectById:"http://localhost:8080/api/updateSaveAsDraftProjectById",
getDraftedProjectViewList:"http://localhost:8080/api/getDraftedProjectViewList",
publishProject:"http://localhost:8080/api/publishProject",
discardProject:"http://localhost:8080/api/discardProject",
getToken:"http://localhost:8080/api/authenticate",
getMarkerMasterOptionsDetails:"http://localhost:8080/api/getMarkerMasterOptionsDetails",
getProvinceByFinancialAgreementId:"http://localhost:8080/api/getProvinceByFinancialAgreementId",
getDistrictByFinancialAgreementId:"http://localhost:8080/api/getDistrictByFinancialAgreementId",
getFinancialAgreementByFundingId:"http://localhost:8080/api/getFinancialAgreementByFundingId",
getFinancialAgreementIdAndNames:"http://localhost:8080/api/getFinancialAgreementIdAndNames",
getFinancialAgreementIdAndNamesByUserAccess:"http://localhost:8080/api/getFinancialAgreementIdAndNamesByUserAccess",
getDisbursementByFundingId:"http://localhost:8080/api/getDisbursementByFundingId",
getPaymentByFundingId:"http://localhost:8080/api/getPaymentByFundingId",

getFinancialAgreementCommitmentsByFundingId:"http://localhost:8080/api/getFinancialAgreementCommitmentsByFundingId",

// getTokenForEsnip:"http://api-esnip-demo.torusline.com//api/v1/auth/login",
getTokenForEsnip:"http://172.31.4.59:8000/api/v1/auth/login",
getAllTheProjectsFromEsnip:"http://api-esnip-demo.torusline.com/api/v1/integrations/aims/get-all-projects/",
// getProjectsFromEsnipById:"http://api-esnip-demo.torusline.com/api/v1/integrations/aims/get-project-details/",
// getProjectsFromEsnipById:"http://172.31.4.59:8000/api/v1/integrations/aims/get-project-details/",
getProjectsFromEsnipById:"http://localhost:8080/api/getidProjectESNIPPDetails",
shareProjectToESnip:"http://api-esnip-demo.torusline.com/api/v1/integrations/aims/share-project-details",
checkDuplicateProjectTitle:"http://localhost:8080/api/checkDuplicateProjectTitle",
checkDuplicateOrganization:"http://localhost:8080/api/checkDuplicateOrganization",
getDraftedIndividualList: "http://localhost:8080/api/getDraftedIndividual",
pubishIndividualById: "http://localhost:8080/api/publishIndividual",
discardIndividualById: "http://localhost:8080/api/discardIndividual",
searchEsnipListByTitel:"http://localhost:8080/api/searchEsnipListByTitel",
downloadProjectDetailsExcel:"http://localhost:8080/api/download/downloadProjectDetailsExcel/",
checkDuplicateFundingOnproject:"http://localhost:8080/api/checkDuplicateFundingOnproject",
shareProjectToMozgis:"http://dev.mozgis.gov.mz:21037/api/Integration/CreateFinancialAgreement",
InactivateProjectMozgis:"http://dev.mozgis.gov.mz:21037/api/Integration/InactivateProject",
UpdateFinancialAgreementMozgis:"http://dev.mozgis.gov.mz:21037/api/Integration/UpdateFinancialAgreement",
//Project crud urls end

// Filed Management crud start
purposeDacCrsThreeDigitAllURL:"http://localhost:8080/api/getAllThreeDigitDacCrs",
allCurrencyURL:"http://localhost:8080/api/getAllCurrencyDetails",
allCountryDialingCodeURl:"http://localhost:8080/api/getAllCountryDialingCodeDetails",
allCategoryURL:"http://localhost:8080/api/getAllCategoryDetails",
allLevelOfActionUrl:"http://localhost:8080/api/getAllLevelOfAction",
allProvincesURL:"http://localhost:8080/api/getAllProvincesDetails",
allDistrictURL:"http://localhost:8080/api/getAllDistrictsDetails",
allImplementingOrganizationURL:"http://localhost:8080/api/getAllImplementingOrganizationDetails",
allReasonForAddendumUrl:"http://localhost:8080/api/getAllReasonForAddendumDetails",
allFindingURL:"http://localhost:8080/api/getAllFindingDetails",
allOptionForFindingURL:"http://localhost:8080/api/getAllOptionFindingDetails",
allConstraintURL:"http://localhost:8080/api/getAllConstraintDetails",
allRecommendationURL:"http://localhost:8080/api/getAllRecommendationDetails",
allProjectSituationURL:"http://localhost:8080/api/getAllprojectSituationDetails",
allResponsibleOrg:"http://localhost:8080/api/getAllResponsibleOrganizationDetails",
allSustainableDevelopmentGoal:"http://localhost:8080/api/getAllSustainableDevelopmentGoalDetails",
allSustainableDevelopmentTarget:"http://localhost:8080/api/getAllSustainableDelopmentTargetDetails",
allPurposeDacCrsFiveURL:"http://localhost:8080/api/getAllPurposeCodesFiveDigitDetails",
allPermissionDetailsUrl:"http://localhost:8080/api/getAllPermissionsDetails",
allFinancingSituationURL:"http://localhost:8080/api/getAllFinancingSituationDetails",
allCooperationModalitiesURL:"http://localhost:8080/api/getAllCooperationModalities",
allComesInLikeURL:"http://localhost:8080/api/getAllComesInLike",
allTypeofImplementationURL:"http://localhost:8080/api/getAllTypeOfImplementationDetails",
allStateBudgetURL:"http://localhost:8080/api/getAllStateBudgetDetails",
allTypeofFinanceURL:"http://localhost:8080/api/getAllTypeOfFinanceDetails",
allPillarPQGURL:"http://localhost:8080/api/getAllPillarPqgMeoDetails",
allStrategicPqgMeoURL:"http://localhost:8080/api/getAllStrategicObjPqgMeoDetails",
allbudgetSupportURL:"http://localhost:8080/api/getAllBudgetSupportDetails",
allCountryUrl:"http://localhost:8080/api/getAllCountryDetails",
allMarkerMaster:"http://localhost:8080/api/getAllMarkerMasterDetails",
allMarkerMasterOptionsDetails:"http://localhost:8080/api/getAllMarkerMasterOptionsDetails",
getAllCovid19MasterDetails:"http://localhost:8080/api/getAllCovid19MasterDetails",
getAllGenderEqualityMarkerDetails:"http://localhost:8080/api/getAllGenderEqualityMarkerDetails",
getAllRioMarkerBioDiversityDetails:"http://localhost:8080/api/getAllRioMarkerBioDiversityDetails",
getAllRioMarkerClimateChangeAdaptionDetails:"http://localhost:8080/api/getAllRioMarkerClimateChangeAdaptionDetails",
getAllRioMarkerClimateChangeDesertificationDetails:"http://localhost:8080/api/getAllRioMarkerClimateChangeDesertificationDetails",
getAllRioMarkerClimateChangeMitigationDetails:"http://localhost:8080/api/getAllRioMarkerClimateChangeMitigationDetails",
budgetSupportURL:"http://localhost:8080/api/getBudgetMaster",
// Field Management crud end
passwordSentUrl:"http://localhost:8080/api/passwordSent",
//Session and save as draft auto url start
getExpirationTimeMilliToken:"http://localhost:8080/api/getExpirationTimeMilliToken",
//Session and save as draft auto url end

/* Bulk mail adminstration url start */
bulkMailSendUrl:"http://localhost:8080/api/sendBulkEmail",

/* Bulk mail adminstration url end */

getFeedbacksURL:"http://localhost:8080/api/getFeedbacks",
// get all feedbacks
ignoreFeedbackURL:"http://localhost:8080/api/ignoreFeedback",
//marks a feedback as ignored 
updateFeedbackURL:"http://localhost:8080/api/updateFeedback",
// updates the priority of a Feedback
respondToFeedbackURL:"http://localhost:8080/api/respondToFeedback",
// respond to feedback by mail URL  
getFeedbackByIdURL:"http://localhost:8080/api/getFeedbackById",
// get all feedback By using Feedback Id

captchaValidateUrl:"http://localhost:8080/api/captchValidation",

userIdPasswordValidateUrl:"http://localhost:8080/api/userIdPasswordValidation",
getMpoDetails:"http://localhost:8080/api/getMPODetails"
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.




