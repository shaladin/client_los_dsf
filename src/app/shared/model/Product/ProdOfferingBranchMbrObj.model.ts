
export class ProdOfferingBranchMbrObj {
    ProdOfferingBranchMbrId : number;
    OfficeCode : string;
    OfficeName : string;
    AreaCode : string;
    AreaName : string;
    IsAllowedCrt : boolean;
    RowVersion : string;

    constructor(){
        this.ProdOfferingBranchMbrId = 0;
        this.OfficeCode = "";
        this.OfficeName = "";
        this.AreaCode = "";
        this.AreaName = "";
        this.IsAllowedCrt = false;
        this.RowVersion = "";
    }
}