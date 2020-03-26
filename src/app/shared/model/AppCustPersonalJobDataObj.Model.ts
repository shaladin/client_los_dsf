import { AppCustAddrObj } from "./AppCustAddrObj.Model";

export class AppCustPersonalJobDataObj {
    AppCustPersonalJobDataId: any;
    AppCustPersonalId: any;
    MrProfessionCode: any;
    CompanyName: any;
    MrJobPositionCode: any;
    MrJobStatCode: any;
    IsMfEmp: any;
    IndustryTypeCode: any;
    MrCompanyScaleCode: any;
    EstablishmentDt: any;
    MrJobTitleCode: any;
    ProfessionalNo: any;
    MrInvestmentTypeCode: any;
    NumOfEmployee: any;
    AppCustAddrJobObj: AppCustAddrObj;


constructor() { 
        this.AppCustPersonalJobDataId = 0;
        this.AppCustPersonalId = 0;
        // this.MrProfessionCode = "";
        // this.CompanyName = "";
        // this.MrJobPositionCode = "";
        // this.MrJobStatCode = "";
        // this.IsMfEmp = false;
        // this.IndustryTypeCode = "";
        // this.MrCompanyScaleCode = "";
        // this.EstablishmentDt = new Date();
        // this.MrJobTitleCode = "";
        // this.ProfessionalNo = "";
        // this.MrInvestmentTypeCode = "";
        // this.NumOfEmployee = 0;
    }
}
