import { LtkmCustAddrObj } from "./LtkmCustAddrObj.Model";

export class LtkmCustPersonalJobDataObj {
    LtkmCustPersonalJobDataId: number;
    LtkmCustPersonalId: number;
    MrProfessionCode: string;
    MrProfessionName: string;
    ProfessionName: string;
    CompanyName: string;
    MrJobPositionCode: string;
    MrJobStatCode: string;
    IsMfEmp: boolean;
    IndustryTypeCode: string;
    IndustryTypeName: string;
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
    PrevCoyName: string;
    PrevEmploymentDt: Date;
    OthBizName: string;
    OthBizType: string;
    OthBizIndustryTypeCode: string;
    OthBizJobPosition: string;
    OthBizEstablishmentDt: Date;
    LtkmCustAddrJobObj: LtkmCustAddrObj;
    RowVersion: string[];
    RefSectorEconomySlikCode: string;

    constructor() {
        this.LtkmCustPersonalJobDataId = 0;
        this.LtkmCustPersonalId = 0;
        this.MrProfessionCode = "";
        this.MrProfessionName = "";
        this.ProfessionName = "";
        this.CompanyName = "";
        this.MrJobPositionCode = "";
        this.MrJobStatCode = "";
        this.IsMfEmp = false;
        this.IndustryTypeCode = "";
        this.IndustryTypeName = "";
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
        this.PrevCoyName = "";
        this.PrevEmploymentDt = new Date();
        this.OthBizName = "";
        this.OthBizType = "";
        this.OthBizIndustryTypeCode = "";
        this.OthBizJobPosition = "";
        this.OthBizEstablishmentDt = new Date();
        this.RowVersion = [];
        this.LtkmCustAddrJobObj = new LtkmCustAddrObj();
    }
}
