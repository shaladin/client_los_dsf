import { LifeInsDObj } from "./LifeInsDObj.Model";

export class LifeInsObj {
    AppLifeInsHId: any;
    AppId: any;
    RowVersion: any;
    MrLifeInsPaidMethodCode : any;
    IsCustCover : any;
    LifeInscoBranchCode : any;
    LifeInscoBranchName : any;
    TotalLifeInsCptlzAmt : any;
    NewCoverNotes : any;
    InscoAdminFeeAmt: any;
    LifeInsDObj : LifeInsDObj;
  constructor() { this.AppLifeInsHId = 0; this.RowVersion = "" ; this.LifeInsDObj = new LifeInsDObj();}
}
