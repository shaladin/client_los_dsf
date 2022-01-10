import { environment } from "environments/environment";
import { URLConstant } from "../constant/URLConstant";
import { EnvisObj } from "./input-lookup-obj.model";

export class RefAttrSettingObj {
    IsVertical: boolean;
    IsDisable: boolean;
    IsShowBtnRefresh: boolean;
    UrlGetLookupExistingValue: string;
    UrlGetRuleForAttrContent: string;
    UrlGetListAttr: string;
    ReqGetListAttrObj: object;
    Title: string;
    urlQryPaging: string;
    urlEnviPaging: string;
    listEnvironments: Array<EnvisObj>;
    LookupJson: string;
    constructor() {
        this.IsVertical = false;
        this.IsDisable = false;
        this.IsShowBtnRefresh = true;
        this.UrlGetLookupExistingValue = URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode;
        this.UrlGetRuleForAttrContent = URLConstant.GetRuleForAttrContent;
        this.UrlGetListAttr = "";
        this.ReqGetListAttrObj = {};
        this.Title = "Ref Attribute Generate";
        this.urlQryPaging = URLConstant.GetPagingObjectBySQL;
        this.urlEnviPaging = environment.FoundationR3Url + "/v1";
        this.listEnvironments = new Array<EnvisObj>();
        this.listEnvironments.push({ environment: "FOU", url: environment.FoundationR3Url + "/v1" });
        this.listEnvironments.push({ environment: "LOS", url: environment.losUrl + "/v1" });
        this.LookupJson = "./assets/uclookup/lookupRefMaster.json";
    }
}