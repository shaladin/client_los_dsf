export class NotificationHObj {
    NotificationHId: number;
    MrNotificationTypeCode: string;
    MrNotificationGroupCode: string;
    MrNotificationMethodCode: string;
    Title: string;
    ShortDesc: string;
    LongDesc: string;
    ReqBy: string;
    ApproveBy: string;
    PublishDt: Date;
    Status: string;
    IsActive: boolean;
    IsDraft: boolean;
    RowVersion: string;

    constructor() {
        this.NotificationHId = 0;
        this.MrNotificationTypeCode = "";
        this.MrNotificationGroupCode = "";
        this.MrNotificationMethodCode = "";
        this.Title = "";
        this.ShortDesc = "";
        this.LongDesc = "";
        this.ReqBy = "";
        this.ApproveBy = "";
        this.PublishDt = new Date();
        this.Status = "";
        this.IsActive = false;
        this.IsDraft = false;
        this.RowVersion = "";
    }
}
