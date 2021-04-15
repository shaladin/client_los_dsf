import { ReqRFAObj } from "../RFA/ReqRFAObj.model";

export class ReqAddProductObj {
    ProdCode: string;
    ProdName: string;
    ProdDescr: string;
    StartDt: Date;
    EndDt: Date;
    RowVersion: string;

    constructor() {
        this.ProdCode = "";
        this.ProdName = "";
        this.ProdDescr = "";
        this.StartDt = new Date();
        this.EndDt = new Date();
        this.RowVersion = "";
    }
}

export class ReqEditProductObj extends ReqAddProductObj {
    ProdId: number;

    constructor() {
        super();
        this.ProdId = 0;
    }
}

export class ReqListProductDetailObj {
    ProdHId: number;
    ProductDetails: Array<ReqProductDetailDomainObj>;
    RowVersion: string;

    constructor() {
        this.ProdHId = 0;
        this.ProductDetails = new Array<ReqProductDetailDomainObj>();
        this.RowVersion = "";
    }
}

class ReqProductDetailDomainObj {
    ProdHId: number;
    ProdDId: number;
    RefProdCompntCode: string;
    RefProdCompntGrpCode: string;
    CompntValue: string;
    CompntValueDesc: string;
    MrProdBehaviour: string;
    RowVersion: string;

    constructor() {
        this.ProdHId = 0;
        this.ProdDId = 0;
        this.RefProdCompntCode = "";
        this.RefProdCompntGrpCode = "";
        this.CompntValue = "";
        this.CompntValueDesc = "";
        this.MrProdBehaviour = "";
        this.RowVersion = "";
    }
}

export class ReqCopyProductObj {
    ProdHId: number;
    FromProdId: number;

    constructor() {
        this.ProdHId = 0;
        this.FromProdId = 0;
    }
}

export class ReqUpdateProductPostApprovalObj {
    ProdHId: number;
    TaskId: number;
    Result: string;
    Notes: string;
    Reason: string;
    ReasonType: string;

    constructor() {
        this.ProdHId = 0;
        this.TaskId = 0;
        this.Result = "";
        this.Notes = "";
        this.Reason = "";
        this.ReasonType = "";
    }
}

export class ReqReviewProductObj {
    ProdHId: number;
    ProdId: number;
    WfTaskListId: number;
    RequestRFAObj: ReqRFAObj;

    constructor() {
        this.ProdHId = 0;
        this.ProdId = 0;
        this.WfTaskListId = 0;
        this.RequestRFAObj = new ReqRFAObj();
    }
}
