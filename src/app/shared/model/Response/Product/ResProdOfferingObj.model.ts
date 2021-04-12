import { ProdOfferingObj } from "../../Product/ProdOfferingObj.model";

export class ResProdOfferingHObj {
    ProdOfferingHId : number;
    ProdOfferingId : number;
    ProdHId: number;
    ProdName : string;
    CurrentProdOfferingHId: number;
    DraftProdOfferingHId: number;
    ProdOfferingCode : string;
    ProdOfferingName : string;
    ProdOfferingDescr : string;
    ProdOfferingStat : string;
    ProdOfferingVersion : string;
    ReturnNotes : string;
    StartDt : Date;
    EndDt : Date;
    RowVersion : string;

    constructor() {
        this.ProdOfferingHId = 0;
        this.ProdOfferingId = 0;
        this.ProdHId = 0;
        this.ProdName = "";
        this.CurrentProdOfferingHId = 0;
        this.DraftProdOfferingHId = 0;
        this.ProdOfferingCode = "";
        this.ProdOfferingName = "";
        this.ProdOfferingDescr = "";
        this.ProdOfferingStat = "";
        this.ProdOfferingVersion = "";
        this.ReturnNotes = "";
        this.StartDt = new Date();
        this.EndDt = new Date();
        this.RowVersion = "";
    }
}

export class ResProdOffVersionObj {
    ReturnObject : Array<ProdOfferingObj>

    constructor() {
        this.ReturnObject = new Array<ProdOfferingObj>();
    }
}

export class ResProdOfferingObj {
    ProdOfferingId : number;
    ProdName : string;
    OfficeCode : string;
    OfficeName : string;
    CurrentProdOfferingHId: number;
    DraftProdOfferingHId: number;
    ProdOfferingCode : string;
    ProdOfferingName : string;
    ProdOfferingDescr : string;
    ProdOfferingStat : string;
    ProdOfferingVersion : string;
    ReturnNotes : string;
    StartDt : Date;
    EndDt : Date;
    RowVersion : string;

    constructor() {
        this.ProdOfferingId = 0;
        this.ProdName = "";
        this.OfficeCode = "";
        this.OfficeName = "";
        this.CurrentProdOfferingHId = 0;
        this.DraftProdOfferingHId = 0;
        this.ProdOfferingCode = "";
        this.ProdOfferingName = "";
        this.ProdOfferingDescr = "";
        this.ProdOfferingStat = "";
        this.ProdOfferingVersion = "";
        this.ReturnNotes = "";
        this.StartDt = new Date();
        this.EndDt = new Date();
        this.RowVersion = "";
    }
}