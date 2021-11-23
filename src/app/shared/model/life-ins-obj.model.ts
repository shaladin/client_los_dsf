import { LifeInsDObj } from "./life-ins-d-obj.model";

export class LifeInsObj {
    AppLifeInsHId: number;
    AppId: number;
    RowVersion: string;
    MrLifeInsPaidMethodCode : string;
    IsCustCover : boolean = false;
    IsSpouseCover : boolean = false;
    IsGuarantorCover: boolean = false;
    LifeInscoBranchCode : string;
    LifeInscoBranchName : string;
    PaidInAdvPrcnt : number;
    NewCoverNotes : string;
    InscoAdminFeeAmt: number;
    CustAdminFeeAmt : number;
    ListAppLifeInsD : Array<LifeInsDObj>;
  constructor() { this.AppLifeInsHId = 0; this.RowVersion = "" ; this.ListAppLifeInsD = new Array<LifeInsDObj>();}
}
