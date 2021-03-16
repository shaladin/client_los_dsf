export class UcInputApprovalObj {
    TaskId: number;
    EnvUrl: string;
    PathUrlGetLevelVoting: string;
    PathUrlGetPossibleResult: string;
    PathUrlSubmitApproval: string;
    PathUrlGetNextNodeMember: string;
    PathUrlGetReasonActive:string;
    PathUrlGetChangeFinalLevel: string;
    PathUrlReturnToLevel: string;
    PathUrlContinueToLevel: string;
    RequestId : number;
    PathUrlGetHistory : string;
    TrxNo: string;
    constructor() { 
        this.TaskId = 0;
        this.EnvUrl = "";
        this.PathUrlGetLevelVoting = "";
        this.PathUrlGetPossibleResult = "";
        this.PathUrlSubmitApproval = "";
        this.PathUrlGetNextNodeMember = "";
        this.PathUrlGetReasonActive = "";
        this.PathUrlGetChangeFinalLevel = "";
        this.RequestId = 0;
        this.PathUrlGetHistory = "";
        this.PathUrlReturnToLevel= "";
        this.PathUrlContinueToLevel= "";
        this.TrxNo = "";
    }
}  