import { environment } from "environments/environment";
import { URLConstant } from "../constant/URLConstant";

export class UcInputApprovalObj {
    TaskId: number;
    RequestId : number;
    TrxNo: string;
    EnvUrl: string;
    PathUrlGetLevelVoting: string;
    PathUrlGetPossibleResult: string;
    PathUrlSubmitApproval: string;
    PathUrlGetNextNodeMember: string;
    PathUrlGetReasonActive:string;
    PathUrlGetChangeFinalLevel: string;
    PathUrlReturnToLevel: string;
    PathUrlContinueToLevel: string;
    PathUrlGetHistory : string;
    OfficeCodes: Array<string>;
    EnableRequiredNotes: boolean;
    DisableRequiredNotesList: Array<string>;
    
    constructor() { 
        this.TaskId = 0;
        this.RequestId = 0;
        this.TrxNo = "";
        this.EnvUrl = environment.FoundationR3Url;
        this.PathUrlGetLevelVoting = URLConstant.GetLevelVoting;
        this.PathUrlGetPossibleResult = URLConstant.GetPossibleResult;
        this.PathUrlSubmitApproval = URLConstant.SubmitApproval;
        this.PathUrlGetNextNodeMember = URLConstant.GetNextNodeMemberV2;
        this.PathUrlGetReasonActive = URLConstant.GetRefReasonActive;
        this.PathUrlGetChangeFinalLevel = URLConstant.GetCanChangeMinFinalLevel;
        this.PathUrlReturnToLevel= URLConstant.ReturnLevel;
        this.PathUrlContinueToLevel= URLConstant.ContinueToLevel;
        this.PathUrlGetHistory = URLConstant.GetTaskHistory;
        this.OfficeCodes = new Array<string>();
        this.EnableRequiredNotes = true;
        this.DisableRequiredNotesList = new Array<string>();
    }
}  