export class ReqGetProdCompntObj {
    ProdHId : number;
    GroupCodes : Array<string>; 
    IsFilterBizTmpltCode : boolean;
    Lob : string;
    RowVersion : string;

    constructor(){
        this.ProdHId = 0;
        this.GroupCodes = new Array<string>();
        this.IsFilterBizTmpltCode = false;
        this.Lob = "";
        this.RowVersion = "";
    }
}

export class ReqGetProdOffCompntObj {
    ProdOfferingHId : number;
    GroupCodes : Array<string>; 
    IsFilterBizTmpltCode : boolean;
    RowVersion : string;

    constructor(){
        this.ProdOfferingHId = 0;
        this.GroupCodes = new Array<string>();
        this.IsFilterBizTmpltCode = false;
        this.RowVersion = "";
    }
}