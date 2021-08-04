import { CommonConstant } from "app/shared/constant/CommonConstant";
import { environment } from "environments/environment";

export class UcDropdownListObj {

    enviromentUrl: string;
    apiPath: string;
    apiUrl: string;
    ddlType: string;
    customKey: string;
    customValue: string;
    requestObj: Object;
    isObject: boolean;
    customObjName: string;
    isSelectOutput: boolean;
    isCustomList: boolean;
    isReady: boolean;

    constructor() {
        this.enviromentUrl = environment.FoundationR3Url + "/v1";
        this.apiPath = "";
        this.apiUrl = "";
        this.ddlType = UcDropdownListConstant.DDL_TYPE_ONE; // one | all | none | blank
        this.customKey = "Key";
        this.customValue = "Value";
        this.requestObj = new Object();
        this.isObject = true;
        this.customObjName = CommonConstant.ReturnObj;
        this.isSelectOutput = false;
        this.isCustomList = false;
        this.isReady = false;
    }
}

export class UcDropdownListCallbackObj {
    selectedValue: string;
    selectedObj: any;

    constructor() {
        this.selectedValue = "";
        this.selectedObj = new Object();
    }
}

export class UcDropdownListConstant {
    public static DDL_TYPE_ONE = "one";
    public static DDL_TYPE_ALL = "all";
    public static DDL_TYPE_NONE = "none";
    public static DDL_TYPE_BLANK = "blank";
}