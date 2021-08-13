import { environment } from "environments/environment";

export class SubmitNapObj {
    AppId: number;
    WfTaskListId: any;
    constructor() {
        this.AppId = 0;
        this.WfTaskListId = environment.isCore ? "" : 0;
    }
}