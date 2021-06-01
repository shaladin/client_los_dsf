import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { environment } from "environments/environment";

export class UcThingsToDoObj {
    Url: string;
    RequestObj: ThingsToDoReqObj;

    constructor() {
        this.Url = "";
        this.RequestObj = new ThingsToDoReqObj();
    }
}

export class ThingsToDoReqObj {
    ModuleCode: string;
    IntegrationObj: Array<ThingsToDoIntegrationObj>;

    constructor() {
        this.ModuleCode = CommonConstant.LOAN_ORIGINATION;
        this.IntegrationObj = new Array<ThingsToDoIntegrationObj>();
    }
}

export class ThingsToDoIntegrationObj {
    BaseUrl: string;
    ApiPath: string;
    RequestObj: IntegrationReqObj;

    constructor() {
        this.BaseUrl = environment.WfR3Url;
        this.ApiPath = URLConstant.GetListWfTaskListByUsernameAndRoleCodeAndOfficeCodeForThingsToDo;
        this.RequestObj = new IntegrationReqObj();
    }
}

export class IntegrationReqObj {
    UserName: string;
    Office: string;
    Role: String;

    constructor() {
        this.UserName = "";
        this.Office = "";
        this.Role = "";
    }
}