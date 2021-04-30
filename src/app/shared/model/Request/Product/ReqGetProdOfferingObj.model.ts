export class ReqProdOfferingVersionObj {
    ProdId: number;
    ProdOfferingStat: string;

    constructor() { 
    this.ProdId = 0;
    this.ProdOfferingStat = "";
    }
  }

  export class ReqGetListProdOfferingDObj {
    ProdHId: number;
    GroupCodes: Array<string>;

    constructor() { 
    this.ProdHId = 0;
    this.GroupCodes = new Array<string>();
    }
  }

  export class ReqGetProdOffDByProdOffCodeAndProdCompntCodeObj {
    ProdOfferingCode: string;
    RefProdCompntCode: string;
    constructor() {
      this.ProdOfferingCode = "";
      this.RefProdCompntCode = "";
    }
  }

  export class ReqGetProdOffDByProdOffVersion extends ReqGetProdOffDByProdOffCodeAndProdCompntCodeObj {
    ProdOfferingVersion: string;

    constructor() {
      super();
      this.ProdOfferingVersion = "";
    }
  }