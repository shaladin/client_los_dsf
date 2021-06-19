export class ProdOfferingObj {
    ProdOfferingId : number;
    ProdId : number;
    CurrentProdOfferingHId : number;
    DraftProdOfferingHId : number;
    ProdOfferingCode : string;
    ProdOfferingName : string;
    ProdOfferingDescr : string;
    ProdOfferingStat : string;
    OfficeCode : string;
    OfficeName : string;
    StartDt : Date;
    EndDt : Date;
    ProdOfferingHId: number;
    ProdOfferingVersion: string;
    RowVersion : string;
    

    constructor(){
        this.ProdOfferingId = 0;
        this.ProdId = 0;
        this.CurrentProdOfferingHId = 0;
        this.DraftProdOfferingHId = 0;
        this.ProdOfferingCode = "";
        this.ProdOfferingName = "";
        this.ProdOfferingDescr = "";
        this.ProdOfferingStat = "";
        this.OfficeCode = "";
        this.OfficeName = "";
        this.StartDt = new Date();
        this.EndDt = new Date();
        this.ProdOfferingHId = 0;
        this.ProdOfferingVersion = "";
        this.RowVersion = "";
    }
}