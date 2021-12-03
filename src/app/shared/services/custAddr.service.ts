import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonConstant } from "../constant/CommonConstant";
import { URLConstant } from "../constant/URLConstant";
import { GeneralSettingObj } from "../model/general-setting-obj.model";

@Injectable()
export class AddressService{

    constructor(private http: HttpClient) { }

    public async GetListAddrTypeOwnershipMandatory(): Promise<Array<string>>{
        let GsValues : Array<string> = new Array();

        await this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeOwnershipMandatoryAddrType }).toPromise().then(
            (response: GeneralSettingObj) => {
                GsValues = response.GsValue.split(','); 
            }
        );

        return GsValues;
    }
}