import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { URLConstant } from "app/shared/constant/URLConstant";
import { URLConstantX } from "app/impl/shared/constant/URLConstantX";
import { ReqGetAppFinDataAndFeeObj } from "app/shared/model/request/nap/agr-act/req-app-fin-data-and-fee.model";

@Injectable({
    providedIn: 'root'
})
export class AdminProcessXService {
    constructor(private http: HttpClient) { }

    GetListAppAssetAgrmntActivation(Obj: ReqAppAssetAgreementActivationObj): Observable<Object> {
        return this.http.post(URLConstant.GetAppAssetByAppIdAndCriteria, Obj);
    }

    GetAppFinDataAndFeeByAppIdAndListAppAssetId(Obj: ReqGetAppFinDataAndFeeObj): Observable<Object> {
        return this.http.post(URLConstant.GetAppFinDataAndFeeByAppIdAndListAppAssetId, Obj);
    }

    SubmitAgrmntActivationXByHuman(Obj: any): Observable<Object> {
        return this.http.post(URLConstantX.SubmitAgrmntActivationByHuman, Obj);
    }

    SubmitAgrmntActivationXByHumanV2(Obj: any): Observable<Object> {
        return this.http.post(URLConstantX.SubmitAgrmntActivationByHumanV2, Obj);
    }

    SubmitInsuranceOrder(Obj: any): Observable<Object> {
        return this.http.post(URLConstantX.SubmitInsuranceOrder, Obj);
    }
}

export class ReqAppAssetAgreementActivationObj {
    AppId: number;
    ListAppAssetId: Array<number>;
}

export class ReqAppAssetObjX{
    AgrmntId: number;
    ListAppAssetId: Array<number>;
}