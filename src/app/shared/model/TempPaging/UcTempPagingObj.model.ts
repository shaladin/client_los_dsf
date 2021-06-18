import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { environment } from "environments/environment";
import { CriteriaObj } from "../CriteriaObj.model";

export class UcTempPagingObj {
    urlJson: string;
    enviromentUrl: string;
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

    constructor() {
        this.urlJson = "";
        this.enviromentUrl = environment.losUrl;
        this.apiQryPaging = URLConstant.GetPagingObjectBySQL;
        this.pagingJson = "";
        this.isReady = false;
        this.isSearched = false;
        this.addCritInput = new Array<CriteriaObj>();
        this.ddlEnvironments = new Array<EnviObj>();
        this.listEnvironments = new Array<EnvisObj>();
        this.listEnvironments.push({ environment: "FOU", url: environment.FoundationR3Url });
        this.listEnvironments.push({ environment: "LOS", url: environment.losUrl });
        this.whereValue = new Array<WhereValueObj>();
        this.delay = 0;
        this.isHideSearch = false;
        this.navigationConst = NavigationConstant;
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