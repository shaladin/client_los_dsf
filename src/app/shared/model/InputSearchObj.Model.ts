import { environment } from "environments/environment";
import { AdInsConstant } from "../AdInstConstant";
import { URLConstant } from "../constant/URLConstant";
import { CriteriaObj } from "./CriteriaObj.model";
import { IntegrationObj } from "./library/IntegrationObj.model";

export class InputSearchObj {
    _url: string;
    enviromentUrl: string;
    title: string;
    apiQryPaging: string;
    arrCritObj: any;
    addCritInput: Array<CriteriaObj>;
    ddlEnvironments: Array<EnviObj>;
    whereValue: Array<WhereValueObj>;
    switchValue: Array<SwitchValueObj>;
    integrationObj: IntegrationObj;
    isJoinExAPI: boolean;
    
    constructor() {
        this._url = "";
        this.enviromentUrl = environment.losUrl;
        this.title = "";
        this.apiQryPaging = URLConstant.GetPagingObjectBySQL;
        this.arrCritObj = null;
        this.addCritInput = new Array<CriteriaObj>();
        this.ddlEnvironments = new Array<EnviObj>();
        this.whereValue = new Array<WhereValueObj>();
        this.switchValue = new Array<SwitchValueObj>();
        this.integrationObj = new IntegrationObj();
        this.isJoinExAPI = false;
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

export class SwitchValueObj {
    property: string;
    value: any;

    constructor() {
        this.property = "";
    }
}