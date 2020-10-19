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
    CoyName: string;
    MrCoyScaleCode: string;
    EmploymentEstablishmentDt: Date;
    JobTitleName: string;
    PrevCoyName : string;
    PrevEmploymentDt : Date;
    OthBizName : string;
    OthBizType : string;
    OthBizIndustryTypeCode : string;
    OthBizJobPosition : string;
    OthBizEstablishmentDt : Date;
    AppCustAddrJobObj: AppCustAddrObj;
    RowVersion : string[];

constructor() { 
    this.AppCustPersonalJobDataId = 0;
    this.AppCustPersonalId = 0;
    this.MrProfessionCode = "";
    this.ProfessionName = "";
    this.CompanyName = "";
    this.MrJobPositionCode = "";
    this.MrJobStatCode = "";
    this.IsMfEmp = false;
    this.IndustryTypeCode = "";
    this.MrCompanyScaleCode = "";
    this.EstablishmentDt = new Date();
    this.MrJobTitleCode = "";
    this.ProfessionalNo = "";
    this.MrInvestmentTypeCode = "";
    this.NumOfEmployee = 0;
    this.CoyName = "";
    this.MrCoyScaleCode = "";
    this.EmploymentEstablishmentDt = new Date();
    this.JobTitleName = "";
    this.PrevCoyName  = "";
    this.PrevEmploymentDt = new Date();
    this.OthBizName  = "";
    this.OthBizType  = "";
    this.OthBizIndustryTypeCode  = "";
    this.OthBizJobPosition  = "";
    this.OthBizEstablishmentDt = new Date();
    this.RowVersion = [];
    }
}
