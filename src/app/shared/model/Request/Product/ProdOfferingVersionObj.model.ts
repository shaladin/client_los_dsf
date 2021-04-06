export class ProdOfferingVersionObj {
    ProdOfferingId: number;
    ProdId: number;
    ProdOfferingCode: string;
    ProdOfferingName: string;
    EndDt: Date;
    ProdOfferingStat: string;
    ProdOfferingHId: number;
    ProdOfferingVersion: string;
    RowVersion: string[];
    constructor() { this.RowVersion = [] }
  }
  