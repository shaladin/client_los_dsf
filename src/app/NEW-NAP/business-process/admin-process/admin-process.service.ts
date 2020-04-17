import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AdminProcessService
{
    constructor(private http: HttpClient) { }

    GetListAppAssetAgrmntActivation(Obj : any): Observable<Object> {
        return this.http.post(AdInsConstant.GetAppAssetByAppIdAndCriteria, Obj);
    }

    GetAppFinDataAndFeeByAppIdAndListAppAssetId(Obj : any) : Observable<Object>{
        return this.http.post(AdInsConstant.GetAppFinDataAndFeeByAppIdAndListAppAssetId,Obj);
    }

    SubmitAgrmntActivationByHuman(Obj: any) : Observable<Object>{
        return this.http.post(AdInsConstant.SubmitAgrmntActivationByHuman, Obj);
    }
}