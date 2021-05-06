export class ResReturnHandlingDObj {
    ReturnHandlingDId : number;
    ReturnHandlingHId : number;
    MrReturnTaskCode : string;
    ReturnStat : string;
    ReturnHandlingNotes : string;
    ReturnHandlingExecNotes : string;
    RowVersion : string;

    constructor(){
        this.ReturnHandlingDId = 0;
        this.ReturnHandlingHId = 0;
        this.MrReturnTaskCode = "";
        this.ReturnStat = "";
        this.ReturnHandlingNotes = "";
        this.ReturnHandlingExecNotes = "";
        this.RowVersion = "";
    }
}