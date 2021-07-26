import { URLConstant } from "../constant/URLConstant"
import { environment } from "environments/environment"

export class InputLookupAddr{
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
    ddlEnvironments : any
    title: string;

    constructor()
    {
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
    }
}