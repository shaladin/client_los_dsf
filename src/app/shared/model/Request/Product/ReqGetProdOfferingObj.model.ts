export class ReqProdOffVersionObj {
    ProdOfferingId: number;
    ProdId: number;
    ProdOfferingCode: string;
    ProdOfferingName: string;
    EndDt: Date;
    ProdOfferingStat: string;
    ProdOfferingHId: number;
    ProdOfferingVersion: string;
    RowVersion: string;

    constructor() { 
    this.ProdOfferingId = 0;
    this.ProdId = 0;
    this.ProdOfferingCode = "";
    this.ProdOfferingName = "";
    this.EndDt = new Date();
    this.ProdOfferingStat = "";
    this.ProdOfferingHId = 0;
    this.ProdOfferingVersion = "";
    this.RowVersion = "";
    }
  }
  