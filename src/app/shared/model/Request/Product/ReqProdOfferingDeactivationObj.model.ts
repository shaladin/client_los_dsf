import { ReqRFAObj } from "../RFA/ReqRFAObj.model";

export class ReqProdOfferingHDeactivationObj {
    ProdOfferingHId: number;
    EffectiveDate: Date;
    Reason: string;
    Notes: string;
    RowVersion: string;
    RequestRFAObj : ReqRFAObj;
    constructor() { 
      this.ProdOfferingHId = 0;
      this.EffectiveDate= new Date();
      this.Reason = "";
      this.Notes = "";
      this.RowVersion = "";
      this.RequestRFAObj = new ReqRFAObj();
    }
  }