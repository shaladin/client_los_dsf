import { environment } from "environments/environment";

export class ClaimTaskNapCustMainDataObj{
    AppId : number;
    Username : string;
    WfTaskListId : any;

    constructor() {
        this.AppId = 0;
        this.Username = "";
        this.WfTaskListId = environment.isCore ? "" : 0;
    }
}