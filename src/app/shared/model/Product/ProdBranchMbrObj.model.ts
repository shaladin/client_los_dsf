
export class ProdBranchMbrObj {
    ProdBranchMbrId : number;
    RefOfficeId : number;
    OfficeCode : string;
    OfficeName : string;
    AreaName : string;
    IsAllowedCrt : boolean;
    RowVersion : string;

    constructor(){
        this.ProdBranchMbrId = 0;
        this.RefOfficeId = 0;
        this.OfficeCode = "";
        this.OfficeName = "";
        this.AreaName = "";
        this.IsAllowedCrt = false;
        this.RowVersion = "";
    }
}