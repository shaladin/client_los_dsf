import { ProdOfferingBranchMbrObj } from "../../Product/ProdOfferingBranchMbrObj.model";

export class ResGetProdOfferingBranchMbrObj {
    ReturnObject: Array<ResGetListProdOffBranchMbrObj>;

    constructor() {
        this.ReturnObject = new Array<ResGetListProdOffBranchMbrObj>();
    }
}

export class ResGetListProdOffBranchMbrObj {
    ProdOfferingId: number;
    ProdId: number;
    ProdOfferingCode: string;
    ProdOfferingName: string;
    EndDt: Date;
    ProdOfferingStat: string;
    ProdOfferingHId: number;
    ProdOfferingVersion: string;
    RowVersion: string;

    constructor() {
        this.ProdOfferingId = 0;
        this.ProdId = 0;
        this.ProdOfferingCode = "";
        this.ProdOfferingName = "";
        this.EndDt = new Date();
        this.ProdOfferingStat = "";
        this.ProdOfferingHId = 0;
        this.ProdOfferingVersion = "";
        this.RowVersion = "";
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