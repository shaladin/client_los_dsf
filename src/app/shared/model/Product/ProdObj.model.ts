export class ProdObj {
    ProdId : number;
    CurrentProdId : number;
    DraftProdHId : number;
    ProdCode : string;
    ProdName : string;
    ProdDescr : string;
    ProdStat : string;
    StartDt : Date;
    EndDt : Date;
    RowVersion : string[];

    constructor() {
        this.ProdId = 0;
        this.CurrentProdId = 0;
        this.DraftProdHId = 0;
        this.ProdCode = "";
        this.ProdName = "";
        this.ProdDescr = "";
        this.ProdStat = "";
        this.StartDt = new Date();
        this.EndDt = new Date();
        this.RowVersion = [];
    }
}
