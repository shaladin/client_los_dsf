export class ResProductHObj {
    ProdHId : number;
    ProdId : number; 
    ProdCode : string;
    ProdName : string;
    ProdDescr : string;
    ProdStat : string;
    ProdVersion : string;
    StartDt : Date
    EndDt : Date
    RowVersion : string;

    constructor(){
        this.ProdHId = 0;
        this.ProdId = 0;
        this.ProdCode = "";
        this.ProdName = "";
        this.ProdDescr = "";
        this.ProdStat = "";
        this.ProdVersion = "";
        this.StartDt = new Date();
        this.EndDt = new Date();
        this.RowVersion = "";
    }

}