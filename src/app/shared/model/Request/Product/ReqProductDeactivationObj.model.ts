export class ReqProductDeactivationObj {
    ProdHId: number;
    EffectiveDate: Date;
    Reason: string;
    Notes: string;
    RowVersion: string;
    RequestRFAObj : any;

    constructor() { 
      this.ProdHId = 0;
      this.EffectiveDate = new Date();
      this.Reason = "";
      this.Notes = "";
      this.RowVersion = "";
    }
  }
  