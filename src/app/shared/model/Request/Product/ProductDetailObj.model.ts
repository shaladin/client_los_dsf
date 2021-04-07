export class ProductDetailObj {
    ProdDId: number;
    ProdHId: number;
    RefProdCompntCode: string;
    RefProdCompntGrpCode: string;
    CompntValue: string;
    CompntValueDesc: string;
    MrProdBehaviour: string;
    RowVersion: string[];
    GroupCodes: any;
    constructor() { this.RowVersion = [] }
  }
  