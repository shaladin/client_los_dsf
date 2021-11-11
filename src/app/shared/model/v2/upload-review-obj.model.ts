import { environment } from "environments/environment";

export class UploadReviewCustomObj{
    TaskListId : any;
    UploadMonitoringNo : string;
    MrUploadStatusCode : string;

    constructor() {
        this.TaskListId = environment.isCore ? "" : 0;
        this.UploadMonitoringNo = "";
        this.MrUploadStatusCode = "";
    }
}
