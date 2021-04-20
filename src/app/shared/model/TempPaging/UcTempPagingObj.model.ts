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

    constructor() {
        this.urlJson = "";
        this.enviromentUrl = environment.losUrl;
        this.apiQryPaging = URLConstant.GetPagingObjectBySQL;
        this.pagingJson = "";
        this.isReady = false;
        this.isSearched = false;
        this.addCritInput = new Array<CriteriaObj>();
        this.ddlEnvironments = new Array<EnviObj>();
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