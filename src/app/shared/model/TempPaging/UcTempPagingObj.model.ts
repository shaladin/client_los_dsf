import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { environment } from "environments/environment";
import { CriteriaObj } from "../CriteriaObj.model";
import { IntegrationObj } from "../library/IntegrationObj.model";

export class UcTempPagingObj {
    urlJson: string;
    enviromentUrl: string;
    title: string;
    apiQryPaging: string;
    pagingJson: string;
    isReady: boolean;
    isSearched:boolean;
    addCritInput: Array<CriteriaObj>;
    ddlEnvironments: Array<EnviObj>;
    whereValue: Array<WhereValueObj>;
    delay: number;
    isHideSearch: boolean;
    navigationConst: any;
    listEnvironments: Array<EnvisObj>;
    isJoinExAPI: boolean;
    integrationObj: IntegrationObj;

    constructor() {
        this.urlJson = "";
        this.enviromentUrl = environment.isCore ? environment.losUrl + "/v2" : environment.losUrl + "/v1";
        this.title = "";
        this.apiQryPaging = URLConstant.GetPagingObjectBySQL;
        this.pagingJson = "";
        this.isReady = false;
        this.isSearched = false;
        this.addCritInput = new Array<CriteriaObj>();
        this.ddlEnvironments = new Array<EnviObj>();
        this.listEnvironments = new Array<EnvisObj>();
        this.listEnvironments.push({ environment: "FOU", url: environment.FoundationR3Url + "/v1" });
        this.listEnvironments.push({ environment: "LOS", url: environment.losUrl + "/v1" });
        this.whereValue = new Array<WhereValueObj>();
        this.delay = 0;
        this.isHideSearch = false;
        this.navigationConst = NavigationConstant;
        this.isJoinExAPI = false;
        // this.integrationObj = new IntegrationObj();
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

export class EnvisObj {
    environment: string;
    url: string;

    constructor() {
        this.environment = "";
        this.url = "";
    }
}