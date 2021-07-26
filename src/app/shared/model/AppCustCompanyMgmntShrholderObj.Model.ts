export class AppCustCompanyMgmntShrholderObj {
  AppCustCompanyMgmntShrholderId: number;
  AppCustId: number;
  MrJobPositionCode: string;
  IsSigner: boolean;
  IsActive: boolean;
  IsOwner: boolean;
  AppCustCompanyId: number;
  MgmntShrholderName: string;
  JobPositionName: string;
  SharePrcnt: number;
  MrIdTypeCode: string;
  IdNo: string;
  IdExpiredDt: any;
  BirthPlace: string;
  BirthDt: any;
  MrGenderCode: string;
  MrNationalityCode: string;
  NationalityCountryCode: string;
  TaxIdNo: string;
  MobilePhnNo: string;
  Email: string;
  IndustryTypeCode: string;
  EstablishmentDt: any;
  MrCompanyTypeCode: string;
  MrCustTypeCode: string;
  CustTypeName: string;
  CustNo: string;
  IsGuarantor: boolean;
  RowVersion: string[];

  constructor() {
    this.AppCustCompanyId = 0;
    this.AppCustId = 0;
    this.MgmntShrholderName = "";
    this.MrJobPositionCode = "";
    this.SharePrcnt = 0;
    this.IsSigner = false;
    this.IsOwner = false;
    this.IsActive = false;
    this.MrIdTypeCode = "";
    this.IdNo = "";
    this.BirthPlace = "";
    this.MrGenderCode = "";
    this.MrNationalityCode = "";
    this.NationalityCountryCode = "";
    this.TaxIdNo = "";
    this.MobilePhnNo = "";
    this.Email = "";
    this.IndustryTypeCode = "";
    this.MrCompanyTypeCode = "";
    this.MrCustTypeCode = "";
    this.CustNo = "";
    this.IsGuarantor = false;
    this.RowVersion = [];
  }
}
