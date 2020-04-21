export class ReturnHandlingDObj {
    ReturnHandlingDId: number;
    ReturnHandlingHId: number;
    MrReturnTaskCode: string;
    ReturnTaskName: string;
    ReturnStat: string;
    ReturnStatName: string;
    ReturnHandlingNotes: string;
    ReturnHandlingExecNotes : string;
    WfTaskListId: number;
    AppId: number;
    RowVersion: any;

    constructor() {
        this.RowVersion = ""; 
    }
}
