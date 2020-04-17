import { LifeInsDObj } from "./LifeInsDObj.Model";

export class LifeInsObj {
    AppLifeInsHId: any;
    AppId: any;
    RowVersion: any;
    MrLifeInsPaidMethodCode : any;
    IsCustCover : any;
    IsSpouseCover : any;
    IsGuarantorCover: any;
    LifeInscoBranchCode : any;
    LifeInscoBranchName : any;
    TotalLifeInsCptlzAmt : any;
    NewCoverNotes : any;
    InscoAdminFeeAmt: any;
    ListAppLifeInsD : Array<LifeInsDObj>;
  constructor() { this.AppLifeInsHId = 0; this.RowVersion = "" ; this.ListAppLifeInsD = new Array<LifeInsDObj>();}
}
