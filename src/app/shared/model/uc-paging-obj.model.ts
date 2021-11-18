import { environment } from "environments/environment";
import { NavigationConstant } from "../constant/NavigationConstant";
import { URLConstant } from "../constant/URLConstant";
import { CriteriaObj } from "./criteria-obj.model";
import { IntegrationObj } from "./library/integration-obj.model";

export class UcPagingObj {
    _url: string;
    enviromentUrl: string;
    title: string;
    apiQryPaging: string;
    deleteUrl: string;
    pagingJson: string;
    arrCritObj: any;
    addCritInput: Array<CriteriaObj>;
    ddlEnvironments: Array<EnviObj>;
    whereValue: Array<WhereValueObj>;
    fromValue: Array<FromValueObj>;
    switchValue: Array<SwitchValueObj>;
    isHideSearch: boolean;
    delay: number;
    isSearched: boolean;
    navigationConst: any;
    listEnvironments: Array<EnvisObj>;
    isJoinExAPI: boolean;
    integrationObj: IntegrationObj;

    constructor() {
        this._url = "";
        this.title = "";
        this.enviromentUrl = environment.isCore ? environment.losUrl + "/v2" : environment.losUrl + "/v1";
        this.apiQryPaging = URLConstant.GetPagingObjectBySQL;
        this.deleteUrl = "";
        this.pagingJson = "";
        this.arrCritObj = null;
        this.addCritInput = new Array<CriteriaObj>();
        this.ddlEnvironments = new Array<EnviObj>();
        this.listEnvironments = new Array<EnvisObj>();
        this.listEnvironments.push({ environment: "FOU", url: environment.FoundationR3Url  + "/v1"});
        this.listEnvironments.push({ environment: "LOS", url: environment.losUrl  + "/v1"});
        this.listEnvironments.push({ environment: "LOSV2", url: environment.losUrl  + "/v2"});
        this.whereValue = new Array<WhereValueObj>();
        this.fromValue = new Array<FromValueObj>();
        this.switchValue = new Array<SwitchValueObj>();
        this.isHideSearch = false;
        this.delay = 0;
        this.isSearched = false;
        this.navigationConst = NavigationConstant;
        this.isJoinExAPI = false;
        this.integrationObj = new IntegrationObj();
    }
}
export class EnviObj {
    name: string;
    environment: string;

    constructor() {
        this.name = "";
        this.environment = "";
    }
}
export class WhereValueObj {
    property: string;
    value: any;

    constructor() {
        this.property = "";
    }
}
export class FromValueObj {
    property: string;
    value: any;

    constructor() {
        this.property = "";
    }
}
export class SwitchValueObj {
    property: string;
    value: any;

    constructor() {
        this.property = "";
    }
}
export class EnvisObj {
    environment: string;
    url: string;

    constructor() {
        this.environment = "";
        this.url = "";
    }
}

export class ApprovalReqObj {
    Username: string;
    CategoryCode: string;
    CategoryCodes: Array<string>;
    RoleCode: string;
    OfficeCode: string;
    constructor() {
        this.Username = "";
        this.CategoryCode = "";
        this.CategoryCodes = new Array<string>();
        this.RoleCode = "";
        this.OfficeCode = "";
    }
}

export class WorkflowReqObj {
    ActCode: string;
    constructor() {
        this.ActCode = "";
    }
}