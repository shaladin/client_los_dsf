import { AppGuarantorCompanyLegalDocObj } from "./AppGuarantorCompanyLegalDocObj.Model";

export class AppGuarantorCompanyObj {
    AppGuarantorCompanyId: any;
    MrCompanyTypeCode: any;
    TaxIdNo: any;
    IndustryTypeCode: any;
    ContactName: any;
    MrJobPositionCode: any;
    RowVersion: any;
    ContactEmail :any;
    MobilePhnNo1: any;
    MobilePhnNo2: any;
    FaxArea: any;
    Fax: any;
    PhnArea1:any;
    Phn1: any;
    PhnExt1: any;
    PhnArea2:any;
    Phn2: any;
    PhnExt2: any;
    Addr: any;
    AreaCode1:any;
    AreaCode2: any;
    AreaCode3: any;
    AreaCode4:any;
    City: any;
    Zipcode: any;
    Subzipcode: any;
    LegalDocObjs : any = new Array<AppGuarantorCompanyLegalDocObj>();
  constructor() { this.AppGuarantorCompanyId = 0; this.RowVersion = "" }
}
