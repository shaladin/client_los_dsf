export class ProductOfferingDetailObj {
    ProdOfferingDId: number;
    ProdOfferingHId: number;
    RefProdCompntCode: string;
    RefProdCompntGrpCode: string;
    CompntValue: string;
    CompntValueDesc: string;
    MrProdBehaviour: string;
    RowVersion: string[];
    GroupCodes: any;
  
    constructor() { this.ProdOfferingDId=0; this.RowVersion = []}
  
  }
  