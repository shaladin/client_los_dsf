export class ReqListProdBranchMbrObj {
    ProductBranchMbrs : Array<ReqProdBranchMbrDomainObj>;

    constructor(){
        this.ProductBranchMbrs = new Array<ReqProdBranchMbrDomainObj>();
    }
}

class ReqProdBranchMbrDomainObj {
    ProdBranchMbrId : number;
    ProdHId : number;
    OfficeCode : string;
    OfficeName : string;
    AreaCode : string;
    AreaName : string;
    IsAllowedCrt : boolean;
    RowVersion : string;

    constructor(){
        this.ProdBranchMbrId = 0;
        this.ProdHId = 0;
        this.OfficeCode = "";
        this.OfficeName = "";
        this.AreaCode = "";
        this.AreaName = "";
        this.IsAllowedCrt = false;
        this.RowVersion = "";
    }
}