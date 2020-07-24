import { AppCustAddrObj } from "./AppCustAddrObj.Model";

export class AppCustPersonalJobDataObj {
    AppCustPersonalJobDataId: number;
    AppCustPersonalId: number;
    MrProfessionCode: string;
    ProfessionName: string;
    CompanyName: string;
    MrJobPositionCode: string;
    MrJobStatCode: string;
    IsMfEmp: boolean;
    IndustryTypeCode: string;
    MrCompanyScaleCode: string;
    EstablishmentDt: Date;
    MrJobTitleCode: string;
    ProfessionalNo: string;
    MrInvestmentTypeCode: string;
    NumOfEmployee: number;
    AppCustAddrJobObj: AppCustAddrObj;


constructor() { 
        this.AppCustPersonalJobDataId = 0;
        this.AppCustPersonalId = 0;
        this.IsMfEmp = false;
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
