import { environment } from "environments/environment";
import { NavigationConstant } from "../constant/NavigationConstant";
import { URLConstant } from "../constant/URLConstant";
import { CriteriaObj } from "./CriteriaObj.model";

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
    isHideSearch: boolean;
    delay: number;
    isSearched: boolean;
    navigationConst: any;
    listEnvironments: Array<EnvisObj>;

    constructor() {
        this._url = "";
        this.title = "";
        this.enviromentUrl = environment.losUrl;
        this.apiQryPaging = URLConstant.GetPagingObjectBySQL;
        this.deleteUrl = "";
        this.pagingJson = "";
        this.arrCritObj = null;
        this.addCritInput = new Array<CriteriaObj>();
        this.ddlEnvironments = new Array<EnviObj>();
        this.listEnvironments = new Array<EnvisObj>();
        this.listEnvironments.push({ environment: "FOU", url: environment.FoundationR3Url });
        this.listEnvironments.push({ environment: "LOS", url: environment.losUrl });
        this.whereValue = new Array<WhereValueObj>();
        this.isHideSearch = false;
        this.delay = 0;
        this.isSearched = false;
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