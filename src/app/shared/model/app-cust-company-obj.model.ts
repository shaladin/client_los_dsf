export class AppCustCompanyObj {
    AppCustCompanyId: number;
    AppCustId: number;
    CompanyBrandName: string;
    MrCompanyTypeCode: string;
    IndustryTypeCode: string;
    IndustryTypeName: string;
    RegistrationNo: string;
    LicenseNo: string;
    NumOfEmp: number;
    MrInvestmentTypeCode: string;
    EstablishmentDt: Date;
    IsAffiliated: boolean;
    Website: string;
    PhnArea1: string;
    Phn1: string;
    PhnExt1: string;
    PhnArea2: string;
    Phn2: string;
    PhnExt2: string;
    Email1: string;
    Email2: string;
    IsTaxable: boolean;
    RowVersion: any;
constructor() { 
        this.AppCustCompanyId = 0;
        this.AppCustId = 0;
        this.CompanyBrandName = "";
        this.MrCompanyTypeCode = "";
        this.IndustryTypeCode = "";
        this.RegistrationNo = "";
        this.LicenseNo = "";
        this.NumOfEmp = 0;
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
        this.IsTaxable = false;
    }
}