import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { Observable } from "rxjs";
import { URLConstant } from "app/shared/constant/URLConstant";

@Injectable({
    providedIn: 'root'
})
export class AdminProcessService {
    constructor(private http: HttpClient) { }

    GetListAppAssetAgrmntActivation(Obj: ReqAppAssetAgreementActivationObj): Observable<Object> {
        return this.http.post(URLConstant.GetAppAssetByAppIdAndCriteria, Obj);
    }

    GetAppFinDataAndFeeByAppIdAndListAppAssetId(Obj: any): Observable<Object> {
        return this.http.post(URLConstant.GetAppFinDataAndFeeByAppIdAndListAppAssetId, Obj);
    }

    SubmitAgrmntActivationByHuman(Obj: any): Observable<Object> {
        return this.http.post(URLConstant.SubmitAgrmntActivationByHuman, Obj);
    }
}

export class ReqAppAssetAgreementActivationObj {
    AppId: number;
    ListAppAssetId: Array<number>;
}