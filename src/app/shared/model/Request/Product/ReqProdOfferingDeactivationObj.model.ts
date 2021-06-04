import { ReqRFAObj } from "../RFA/ReqRFAObj.model";

export class ReqProdOfferingDeactivationObj {
    ProdOfferingHId: number;
    EffectiveDate: Date;
    Reason: string;
    Notes: string;
    RowVersion: string;
    RequestRFAObj : any;
    constructor() { 
      this.ProdOfferingHId = 0;
      this.EffectiveDate= new Date();
      this.Reason = "";
      this.Notes = "";
      this.RowVersion = "";
    }
  }