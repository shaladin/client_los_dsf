import { AppCustAddrObj } from "./AppCustAddrObj.Model";

export class AppCustPersonalJobDataObj {
    AppCustPersonalJobDataId: number;
    AppCustPersonalId: number;
    MrProfessionCode: string;
    MrProfessionName: string;
    ProfessionName: string;
    CompanyName: string;
    MrJobPositionCode: string;
    MrJobStatCode: string;
    IsMfEmp: boolean;
    IsWellknownCoy: boolean;
    MrWellknownCoyCode: string;
    IndustryTypeCode: string;
    IndustryTypeName: string;
    MrCompanyScaleCode: string;
    EstablishmentDt: Date;
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
    EmpNo: string;
    AppCustAddrJobObj: AppCustAddrObj;
    RowVersion : string[];

constructor() { 
    this.AppCustPersonalJobDataId = 0;
    this.AppCustPersonalId = 0;
    this.MrProfessionCode = "";
    this.MrProfessionName = "";
    this.ProfessionName = "";
    this.CompanyName = "";
    this.MrJobPositionCode = "";
    this.MrJobStatCode = "";
    this.IsMfEmp = false;
    this.IsWellknownCoy = false;
    this.MrWellknownCoyCode = "";
    this.IndustryTypeCode = "";
    this.IndustryTypeName = "";
    this.MrCompanyScaleCode = "";
    this.EstablishmentDt = new Date();
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