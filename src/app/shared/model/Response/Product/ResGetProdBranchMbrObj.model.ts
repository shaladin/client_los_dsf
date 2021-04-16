export class ResGetProdBranchMbrObj {
    ReturnObject : Array<ResProdBranchMbrObj>;

    constructor(){
        this.ReturnObject = new Array<ResProdBranchMbrObj>();
    }
}
export class ResProdBranchMbrObj {
    ProdBranchMbrId: number;
    OfficeCode: string;
    OfficeName: string;
    AreaName: string;
    IsAllowedCrt: boolean;

    constructor(){
    this.ProdBranchMbrId = 0;
    this.OfficeCode = "";
    this.OfficeName = "";
    this.AreaName = "";
    this.IsAllowedCrt = false;
    }
}
