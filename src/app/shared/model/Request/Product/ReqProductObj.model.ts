export class ReqProductObj {    
    ProdId : number;
    ProdCode : string;
    ProdName : string;
    ProdDescr : string;
    StartDt : Date;
    EndDt : Date;
    RowVersion : string;

    constructor() {
        this.ProdId = 0;
        this.ProdCode = "";
        this.ProdName = "";7
        this.ProdDescr = "";
        this.StartDt = new Date();
        this.EndDt = new Date();
        this.RowVersion = "";
    }
}
