import { URLConstant } from "../constant/URLConstant"
import { environment } from "environments/environment"

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

    constructor() {
        this.urlJson = "./assets/uclookup/zipcode/lookupZipcode.json";
        this.urlQryPaging = URLConstant.GetPagingObjectBySQL;
        this.urlEnviPaging = environment.FoundationR3Url;
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
        this.listEnvironments.push({ environment: "FOU", url: environment.FoundationR3Url });
        this.listEnvironments.push({ environment: "LOS", url: environment.losUrl });
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