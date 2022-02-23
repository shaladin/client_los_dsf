import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { Observable } from "rxjs";
import { URLConstant } from "app/shared/constant/URLConstant";
import { ReqGetAppFinDataAndFeeObj } from "app/shared/model/request/nap/agr-act/req-app-fin-data-and-fee.model";
import { environment } from "environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AdminProcessService {
    constructor(private http: HttpClient) { }

    GetListAppAssetAgrmntActivation(Obj: ReqAppAssetAgreementActivationObj): Observable<Object> {
        return this.http.post(URLConstant.GetAppAssetByAppIdAndCriteria, Obj);
    }

    GetAppFinDataAndFeeByAppIdAndListAppAssetId(Obj: ReqGetAppFinDataAndFeeObj): Observable<Object> {
        return this.http.post(URLConstant.GetAppFinDataAndFeeByAppIdAndListAppAssetId, Obj);
    }

    SubmitAgrmntActivationByHuman(Obj: any): Observable<Object> {
        let submitHumanAgrmnActivationUrl = environment.isCore? URLConstant.SubmitAgrmntActivationByHumanV2 : URLConstant.SubmitAgrmntActivationByHuman;
        return this.http.post(submitHumanAgrmnActivationUrl, Obj);
    }

    SubmitAgrmntActivationByHumanV2_1(Obj: any): Observable<Object> {
        return this.http.post(URLConstant.SubmitAgrmntActivationByHumanV2_1, Obj);
    }

    SubmitAgrmntActivationByHumanV2_2(Obj: any): Observable<Object> {
        return this.http.post(URLConstant.SubmitAgrmntActivationByHumanV2_2, Obj);
    }

    GetListAppAssetByListAppAssetId(Obj: any): Observable<Object> {
        return this.http.post(URLConstant.GetListAppAssetByListAppAssetId, Obj);
    }
}

export class ReqAppAssetAgreementActivationObj {
    AppId: number;
    ListAppAssetId: Array<number>;
}