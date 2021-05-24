export class ApprovalObj {
    TaskId: number;
    UsernameMemberId: number;
    IsHold: boolean;

    constructor() {
        this.TaskId = -999;
        this.UsernameMemberId = 0;
        this.IsHold = true;
    }
}