import { ProdOfferingBranchMbrObj } from "../../Product/ProdOfferingBranchMbrObj.model";

export class ResGetProdOfferingBranchMbrObj {
    ReturnObject: Array<ResGetListProdOffBranchMbrObj>;

    constructor() {
        this.ReturnObject = new Array<ResGetListProdOffBranchMbrObj>();
    }
}

export class ResGetListProdOffBranchMbrObj {
    ProdBranchMbrId: number;
    OfficeCode: string;
    OfficeName: string;
    AreaName: string;
    IsAllowedCrt: boolean;

    constructor() {
        this.ProdBranchMbrId = 0;
        this.OfficeCode = "";
        this.OfficeName = "";
        this.AreaName = "";
        this.IsAllowedCrt = false;
    }
}


export class ResGetListProdOfferingBranchMbrObj {
    ReturnObject: Array<ResProdOfferingBranchOfficeMbrObj>;

    constructor() {
        this.ReturnObject = new Array<ResProdOfferingBranchOfficeMbrObj>();
    }
}

export class ResProdOfferingBranchOfficeMbrObj {
    ProdOfferingBranchMbrId: number;
    OfficeCode: string;
    OfficeName: string;
    AreaName: string;

    constructor() {
        this.ProdOfferingBranchMbrId = 0;
        this.OfficeCode = "";
        this.OfficeName = "";
        this.AreaName = "";
    }
}