import { environment } from "environments/environment";

export class UcInputApprovalGeneralInfoObj {
    TaskId: number;
    EnvUrl: string;
    PathUrl: string;
    constructor() { 
        this.TaskId = 0;
        this.EnvUrl = environment.FoundationR3Url + "/v1";
        this.PathUrl = "";
    }
}  