export class AppCustCompanyObj {
    AppCustCompanyId: any;
    AppCustId: any;
    CompanyBrandName: any;
    MrCompanyTypeCode: any;
    IndustryTypeCode: any;
    RegistrationNo: any;
    LicenseNo: any;
    NumOfEmp: any;
    MrInvestmentTypeCode: any;
    EstablishmentDt: any;
    IsAffiliated: any;
    Website: any;
    PhnArea1: any;
    Phn1: any;
    PhnExt1: any;
    PhnArea2: any;
    Phn2: any;
    PhnExt2: any;
    Email1: any;
    Email2: any;

constructor() { 
        this.AppCustCompanyId = 0;
        this.AppCustId = 0;
        this.CompanyBrandName = "";
        this.MrCompanyTypeCode = "";
        this.IndustryTypeCode = "";
        this.RegistrationNo = "";
        this.LicenseNo = "";
        this.NumOfEmp = "";
        this.MrInvestmentTypeCode = "";
        this.EstablishmentDt = new Date();
        this.IsAffiliated = false;
        this.Website = "";
        this.PhnArea1 = "";
        this.Phn1 = "";
        this.PhnExt1 = "";
        this.PhnArea2 = "";
        this.Phn2 = "";
        this.PhnExt2 = "";
        this.Email1 = "";
        this.Email2 = "";
    }
}
