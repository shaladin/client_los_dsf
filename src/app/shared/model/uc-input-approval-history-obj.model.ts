import { environment } from "environments/environment";

export class UcInputApprovalHistoryObj {
    RequestId: number;
    EnvUrl: string;
    PathUrl: string;
    constructor() { 
        this.RequestId = 0;
        this.EnvUrl = environment.FoundationR3Url + "/v1";
        this.PathUrl = "";
    }
}  