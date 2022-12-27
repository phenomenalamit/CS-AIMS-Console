export interface EnvelopeModal {
    envelopeId: number;
    envelopeReference: string;
    fundingOrganization: number;
    currencyMaster: number;
    purposeDacCrs?: null;
    purposeDacCrsPt?: null;
    comments?: string | null;
    status: string;
    createdBy?: null;
    createdOn: string;
    updatedBy?: null;
    updatedOn?: string | null;
    envelopTableData?: null;
    envelopeAllTableData?: (EnvelopeAllTableDataEntity)[] | null;
    fundingOrgList: FundingOrgList;
    currencyList: CurrencyList;
    lockFlag?: string | null;
    saveAsDraftId?: null;
    envelopeTableId?: null;
    currency?: null;
    year?: null;
    endYear?: null;
    amount?: null;
    tableStatus?: null;
    usdAmount?: null;
    userRoleId?: null;
    fundingOrg?: null;
  }
  export interface EnvelopeAllTableDataEntity {
    envelopeTableId: number;
    envelopeId: number;
    purposeDacCrs?: number | null;
    startYear: string;
    endYear?: string | null;
    amount: number;
    tableStatus: string;
    createdBy?: null;
    createdOn: string;
    updatedBy?: null;
    updatedOn?: string | null;
    purposeCode?: PurposeCode | null;
    publishedOn?: null;
    discardedOn?: null;
    draftedOn?: null;
    publishStatus?: string | null;
  }
  export interface PurposeCode {
    purpose_codes_Id: number;
    dac_code: number;
    name_EN: string;
    name_PT: string;
    status: string;
    createdBy?: null;
    createdOn: string;
    updatedBy?: null;
    updatedOn?: string | null;
  }
  export interface FundingOrgList {
    id: number;
    names: string;
    acronym?: string | null;
    category: Category;
    multilateralBilateral?: null;
    emergingNonemerging?: null;
    email?: string | null;
    code1?: Code1OrCode2 | null;
    telephone?: string | null;
    code2?: Code1OrCode21 | null;
    fax?: string | null;
    city?: string | null;
    direction?: string | null;
    country: string;
    country2?: Country2 | null;
    status: string;
    creadtedOn: string;
    updatedOn?: string | null;
    publishedOn?: string | null;
    publishStatus: string;
    draftedOn?: string | null;
    discardedOn?: null;
  }
  export interface Category {
    categoryId: string;
    categoryNameEn: string;
    categoryNamePt: string;
    status: string;
    createdBy?: null;
    createdOn: string;
    updatedBy?: null;
    updatedOn?: null;
  }
  export interface Code1OrCode2 {
    dialingCodeid: number;
    countryName: string;
    dialingCode: string;
    status: string;
  }
  export interface Code1OrCode21 {
    dialingCodeid: number;
    countryName: string;
    dialingCode: string;
    status: string;
  }
  export interface Country2 {
    countryId: string;
    countryName: string;
    status: string;
    createdBy?: null;
    createdOn: string;
    updatedBy?: null;
    updatedOn?: null;
  }
  export interface CurrencyList {
    currency_id: number;
    currency_fullname: string;
    currency_shortname: string;
    status: string;
    createdBy?: null;
    createdOn: string;
    updatedBy?: null;
    updatedOn: string;
  }
  