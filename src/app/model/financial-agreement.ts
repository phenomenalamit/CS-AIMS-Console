import { Comment } from "../components/add-components/add-funding/add-funding.component";
import { FinancialAgreementDistrict, FinancialAgreementProvince } from "../Service-Class/project-model";

export class FinancialAgreement {
	financialAgreementId!:number;

	geography!: string;

    funding_id!:number;

	reference_for_financing_donor!: string;

    donor_funding_title!: string;
	province:string;
    district:string;
	acronym:string;
	countryParentOrg:string;
	signature_date: Date;

  budgetId!: number;

	start_date!: Date;

	end_date!: Date;

	financing_situation!: number;

	type_of_financing_daccrs!: string;

	comments: Comment[]=[];

	enter_as!: string;

	implementation_type: any=[];

	type_of_aid!: string;

	state_budget!: string;

	single_treasury_account!: string;

	direct_implementation!: string;

	amt_local_currency_agreement!: number;

	financing_agreement_currency!: number;

	ugb_meo!: string;

	latitude!: string;

	longitude!: string;

	geolocation_reviews!: string;

	iati_location!: string;

	iati_accuracy!: string;

	meo_resource_source!: string;

	snip_marker!: string;

	pqg_meo_pillar!: string[];

	pqg_meo_strategic_objective!: string;

	form_name!: string;

	vchstatus!: string;

	donor!: string;

    fundingOrganization!: string;

    responsibleOrganization!: string;

	amt_mzn!:number;

	amt_usd!:number;

	amt_grant_equivalent_mzn!:number;

	amt_grant_equivalent_usd!:number;

	years:any[]; //for project module purpose

	updatedOn!:string;

  envelopeReference!:string;
  financialAgreementCurrency:number;
  allocatedAmount:number;
  amountAllocatedInFaMzn:number;
  amountAllocatedInFaUsd:number;
  financing_situationPt:string;
  coOperationModalitiesPt:string;
  language:string;
  allocatedCurrencyName:string;
  provinces:string[];
  districts:string[];
  individualEmails:string[];
  emailChk:boolean;
  fundingOrganizationId:number;
  fundingOrganizationAcronym:string;
  responsibleOrganizationId:number;
  responsibleOrganizationAcronym: string;
  cooperationModalitiesId:number;
  financial_AGREEMENT_DISTRICT:FinancialAgreementDistrict[]=[];
  financial_AGREEMENT_PROVINCE:FinancialAgreementProvince[]=[];

  coOperationModalitiesEn:string;
  typeOfFinance:string;
  typeOfFinancePt:string;
  typeOfImplementation:string;
  priorityPillarPQg:string;
  mpoProgrammaticCode: any;
  records:string[];
}
