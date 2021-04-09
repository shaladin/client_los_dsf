export class ResProductObj {
    ProdId : number; 
    ProdCode : string;
    ProdName : string;
    ProdDescr : string;
    StartDt : Date
    EndDt : Date
    CurrentProdHId : number; 
    DraftProdHId : number; 
    ProdStat : string;
    RowVersion : string;

    constructor(){
        this.ProdId = 0;
        this.ProdCode = "";
        this.ProdName = "";
        this.ProdDescr = "";
        this.StartDt = new Date();
        this.EndDt = new Date();
        this.CurrentProdHId = 0;
        this.DraftProdHId = 0;
        this.ProdStat = "";
        this.RowVersion = "";
    }

}