export class ProdHObj {    
    ProdHId : number;
    ProdId : number;
    ProdCode : string;
    ProdStat : string;
    ProdVersion : number;
    StartDt : Date;
    EndDt : Date;
    RequestDt : Date;
    RequestByUser : string;
    DeactExecutionNotes : string;
    DeactExecutionByUser : string;
    DeactExecutionDt : Date;
    DeactRequestDt : Date;
    DeactEffectiveDt : Date;
    DeactRequestByUser : string;
    DeactReason : string;
    DeactNotes : string;
    ExecutionNotes : string;
    ExecutionDt : Date;
    ExecutionByUser : string;
    ReturnNotes : string;
    RowVersion : string[];

    constructor() {
        this.ProdHId = 0;
        this.ProdId = 0;
        this.ProdCode = "";
        this.ProdStat = "";
        this.ProdVersion = 0;
        this.StartDt = new Date();
        this.EndDt = new Date();
        this.RequestDt = new Date();
        this.RequestByUser = "";
        this.DeactExecutionNotes = "";
        this.DeactExecutionByUser = "";
        this.DeactExecutionDt = new Date();
        this.DeactRequestDt = new Date();
        this.DeactEffectiveDt = new Date();
        this.DeactRequestByUser = "";
        this.DeactReason = "";
        this.DeactNotes = "";
        this.ExecutionNotes = "";
        this.ExecutionDt = new Date();
        this.ExecutionByUser = "";
        this.ReturnNotes = "";
        this.RowVersion = [];
    }
}
