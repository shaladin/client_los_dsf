export class ApprovalObj {
    TaskId: number;
    IsHold: boolean;
    UsernameMemberId: number;

    constructor() {
        this.TaskId = -999
        this.IsHold = true;
        this.UsernameMemberId = 0;
    }
}