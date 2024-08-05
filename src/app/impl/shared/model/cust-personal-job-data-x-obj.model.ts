import { NullAstVisitor } from "@angular/compiler";

export class CustPersonalJobDataXObj {
  CustPersonalJobDataId: number;
  CustId: number;
  RefProfessionId: number;
  CoyName: string;
  MrJobPositionCode: string;
  RefIndustryTypeId: number;
  MrJobStatCode: string;
  ProfessionalNo: string;
  JobTitleName: string;
  EmploymentEstablishmentDt: Date;
  IsMfEmp: boolean;
  IsWellknownCoy: boolean;
  MrWellknownCoyCode: string;
  MrCoyScaleCode: string;
  NoOfEmploy: number;
  MrInvestmentTypeCode: string;
  JobAddrId: number;
  PrevCoyName: string;
  PrevEmploymentDt: Date;
  PrevJobAddrId: number;
  EmpNo: string;
  OthBizName: string;
  OthBizType: string;
  OthBizIndustryTypeCode: string;
  OthBizJobPosition: string;
  OthBizEstablishmentDt: Date;
  OthBizAddrId: number;
  MrCustModelCode: string;
  RowVersion: string;
  RefSectorEconomySlikId: number;

  constructor() {
    this.CustPersonalJobDataId = 0;
    this.CustId = 0;
    this.RefProfessionId = null;
    this.CoyName = "";
    this.MrJobPositionCode = "";
    this.RefIndustryTypeId = null;
    this.MrJobStatCode = "";
    this.ProfessionalNo = "";
    this.JobTitleName = "";
    this.EmploymentEstablishmentDt = null;
    this.IsMfEmp = false;
    this.IsWellknownCoy = false;
    this.MrWellknownCoyCode = "";
    this.MrCoyScaleCode = "";
    this.NoOfEmploy = 0;
    this.MrInvestmentTypeCode = "";
    this.JobAddrId = null;
    this.PrevCoyName = "";
    this.PrevEmploymentDt = null;
    this.PrevJobAddrId = null;
    this.EmpNo = "";
    this.OthBizName = "";
    this.OthBizType = "";
    this.OthBizIndustryTypeCode = "";
    this.OthBizJobPosition = "";
    this.OthBizEstablishmentDt = null;
    this.OthBizAddrId = null;
    this.MrCustModelCode = "";
    this.RowVersion = "";
    this.RefSectorEconomySlikId = 0;
  }
}