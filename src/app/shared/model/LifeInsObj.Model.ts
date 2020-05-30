import { LifeInsDObj } from "./LifeInsDObj.Model";

export class LifeInsObj {
    AppLifeInsHId: any;
    AppId: any;
    RowVersion: any;
    MrLifeInsPaidMethodCode : any;
    IsCustCover : boolean = false;
    IsSpouseCover : boolean = false;
    IsGuarantorCover: boolean = false;
    LifeInscoBranchCode : any;
    LifeInscoBranchName : any;
    PaidInAdvPrcnt : any;
    NewCoverNotes : any;
    InscoAdminFeeAmt: any;
    CustAdminFeeAmt : any;
    ListAppLifeInsD : Array<LifeInsDObj>;
  constructor() { this.AppLifeInsHId = 0; this.RowVersion = "" ; this.ListAppLifeInsD = new Array<LifeInsDObj>();}
}
