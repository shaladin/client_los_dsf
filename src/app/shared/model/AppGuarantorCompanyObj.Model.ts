import { AppGuarantorCompanyLegalDocObj } from "./AppGuarantorCompanyLegalDocObj.Model";

export class AppGuarantorCompanyObj {
    AppGuarantorCompanyId: number;
    MrCompanyTypeCode: string;
    TaxIdNo: string;
    IndustryTypeCode: string;
    ContactName: string;
    MrJobPositionCode: string;
    RowVersion: string;
    ContactEmail :string;
    MobilePhnNo1: string;
    MobilePhnNo2: string;
    FaxArea: string;
    Fax: string;
    PhnArea1:string;
    Phn1: string;
    PhnExt1: string;
    PhnArea2:string;
    Phn2: string;
    PhnExt2: string;
    Addr: string;
    AreaCode1:string;
    AreaCode2: string;
    AreaCode3: string;
    AreaCode4:string;
    City: string;
    Zipcode: string;
    Subzipcode: string;
    LegalDocObjs : Array<AppGuarantorCompanyLegalDocObj> = new Array<AppGuarantorCompanyLegalDocObj>();
  constructor() { this.AppGuarantorCompanyId = 0; this.RowVersion = "" }
}
