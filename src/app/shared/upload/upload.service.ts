import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { URLConstant } from "../constant/URLConstant";
import { GenericObj } from "../model/generic/generic-obj.model";

// GetListUploadTypeKeyValue

// GetUploadTypePaging
// UploadFile

export interface IAuthStatus {
}

@Injectable({
    providedIn: 'root'
})

export class UploadService {
    ReqGenericObj: GenericObj = new GenericObj();

    constructor(private http: HttpClient) {
    }

    getUploadTypeByUploadTypeId(uploadSettingObject: any): Observable<Object> {
        return this.http.post(URLConstant.GetUploadTypeByUploadTypeId, uploadSettingObject);
    }

    getUploadSettingHIdByUploadTypeId(uploadSettingObject: any): Observable<Object> {
        return this.http.post(URLConstant.GetUploadSettingHIdByUploadTypeId, uploadSettingObject);
    }

    getListUploadSettingDIdByUploadSettingHId(uploadSettingObject: any): Observable<Object> {
        return this.http.post(URLConstant.GetListUploadSettingDIdByUploadSettingHId, uploadSettingObject);
    }

    getListUploadSettingDIdByUploadTypeId(uploadSettingObject: any): Observable<Object> {
        return this.http.post(URLConstant.GetListUploadSettingDIdByUploadTypeId, uploadSettingObject);
    }

    assignRoleToUploadSetting(uploadSettingObject: any): Observable<Object> {
        return this.http.post(URLConstant.AssignRoleToUploadSetting, uploadSettingObject);
    }

    getListRefRoleByUploadTypeId(uploadSettingObject: any): Observable<Object> {
        return this.http.post(URLConstant.GetListRefRoleByUploadTypeId, uploadSettingObject);
    }

    getListUploadSettingDByUploadSettingHId(uploadSettingObject: any): Observable<Object> {
        this.ReqGenericObj.Id = uploadSettingObject.UploadSettingHId;
      return this.http.post(URLConstant.GetListUploadSettingDByUploadSettingHId, this.ReqGenericObj);
  }
}
