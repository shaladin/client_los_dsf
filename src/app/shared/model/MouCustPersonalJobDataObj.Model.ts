import { MouCustAddrObj } from "./MouCustAddrObj.Model";

export class MouCustPersonalJobDataObj {
    MouCustPersonalJobDataId: number;
    MouCustPersonalId: number;
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
    MouCustAddrJobObj: MouCustAddrObj;


constructor() { 
        this.MouCustPersonalJobDataId = 0;
        this.MouCustPersonalId = 0;
        this.IsMfEmp = false;
    }
}
