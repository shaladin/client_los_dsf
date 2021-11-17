import { AdInsHelper } from "app/shared/AdInsHelper";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { environment } from "environments/environment";
import { CookieService } from "ngx-cookie";

export class ReqSubmitNAPDataObj {
    AppId : number;
    WfTaskListId : any;
    Username : string;
    
    constructor(){
        this.AppId = 0;
        this.WfTaskListId = environment.isCore? "" : 0;
        this.Username = "";
    }
}
