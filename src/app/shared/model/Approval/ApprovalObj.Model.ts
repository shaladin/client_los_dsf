export class ApprovalObj {
    TaskId: number;
    UsernameMemberId: number;
    IsHold: boolean;
    Username: string;

    constructor() {
        this.TaskId = -999;
        this.UsernameMemberId = 0;
        this.IsHold = true;
        this.Username = "";
    }
}