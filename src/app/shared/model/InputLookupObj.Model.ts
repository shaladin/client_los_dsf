import { URLConstant } from "../constant/URLConstant"
import { environment } from "environments/environment"
import { IntegrationObj } from "./library/IntegrationObj.model"

export class InputLookupObj {
    urlJson: any
    urlQryPaging: any
    urlEnviPaging: any
    _url: any
    nameSelect: any
    idSelect: any
    jsonSelect: any
    addCritInput: any
    isRequired: boolean
    pagingJson: any
    genericJson: any
    isReadonly: boolean
    isReady: boolean
    isDisable: boolean
    ddlEnvironments: any
    title: any;
    listEnvironments: Array<EnvisObj>;
    isJoinExAPI: boolean;
    integrationObj: IntegrationObj;
    
    constructor() {
        this.urlJson = "./assets/uclookup/zipcode/lookupZipcode.json";
        this.urlQryPaging = URLConstant.GetPagingObjectBySQL;
        this.urlEnviPaging = environment.FoundationR3Url + "/v1";
        this.jsonSelect = "";
        this.idSelect = "";
        this.nameSelect = "";
        this.addCritInput = null;
        this.isRequired = true;
        this.isReadonly = true;
        this.isReady = false;
        this.title = "";
        this.isDisable = false;
        this.listEnvironments = new Array<EnvisObj>();
        this.listEnvironments.push({ environment: "FOU", url: environment.FoundationR3Url + "/v1" });
        this.listEnvironments.push({ environment: "LOS", url: environment.losUrl + "/v1" });
        this.isJoinExAPI = false;
        this.integrationObj = new IntegrationObj();
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