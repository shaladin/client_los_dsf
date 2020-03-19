import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { AdInsConstant } from "../AdInstConstant";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

// GetListUploadTypeKeyValue

// GetUploadTypePaging
// UploadFile

export interface IAuthStatus {
}

@Injectable({
    providedIn: 'root'
})

export class UploadService {
    GetUploadTypeByUploadTypeId: any;
    GetUploadSettingHIdByUploadTypeId: any;
    GetListUploadSettingDIdByUploadSettingHId: any;
    GetListUploadSettingDIdByUploadTypeId: any;
    AssignRoleToUploadSetting: any;
    GetListRefRoleByUploadTypeId: any;
    GetListUploadSettingDByUploadSettingHId: any;
    foundationUrl: string = environment.FoundationR3Url;

    constructor(private http: HttpClient) {
        this.GetUploadTypeByUploadTypeId = this.foundationUrl + AdInsConstant.GetUploadTypeByUploadTypeId;
        this.GetUploadSettingHIdByUploadTypeId = this.foundationUrl + AdInsConstant.GetUploadSettingHIdByUploadTypeId;
        this.GetListUploadSettingDIdByUploadSettingHId = this.foundationUrl + AdInsConstant.GetListUploadSettingDIdByUploadSettingHId;
        this.GetListUploadSettingDIdByUploadTypeId = this.foundationUrl + AdInsConstant.GetListUploadSettingDIdByUploadTypeId;
        this.AssignRoleToUploadSetting = this.foundationUrl + AdInsConstant.AssignRoleToUploadSetting;
        this.GetListRefRoleByUploadTypeId = this.foundationUrl + AdInsConstant.GetListRefRoleByUploadTypeId
        this.GetListUploadSettingDByUploadSettingHId = this.foundationUrl + AdInsConstant.GetListUploadSettingDByUploadSettingHId;
    }

    getUploadTypeByUploadTypeId(uploadSettingObject: any): Observable<Object> {
        return this.http.post(this.GetUploadTypeByUploadTypeId, uploadSettingObject);
    }

    getUploadSettingHIdByUploadTypeId(uploadSettingObject: any): Observable<Object> {
        return this.http.post(this.GetUploadSettingHIdByUploadTypeId, uploadSettingObject);
    }

    getListUploadSettingDIdByUploadSettingHId(uploadSettingObject: any): Observable<Object> {
        return this.http.post(this.GetListUploadSettingDIdByUploadSettingHId, uploadSettingObject);
    }

    getListUploadSettingDIdByUploadTypeId(uploadSettingObject: any): Observable<Object> {
        return this.http.post(this.GetListUploadSettingDIdByUploadTypeId, uploadSettingObject);
    }

    assignRoleToUploadSetting(uploadSettingObject: any): Observable<Object> {
        return this.http.post(this.AssignRoleToUploadSetting, uploadSettingObject);
    }

    getListRefRoleByUploadTypeId(uploadSettingObject: any): Observable<Object> {
        return this.http.post(this.GetListRefRoleByUploadTypeId, uploadSettingObject);
    }

    getListUploadSettingDByUploadSettingHId(uploadSettingObject: any): Observable<Object> {
      return this.http.post(this.GetListUploadSettingDByUploadSettingHId, uploadSettingObject);
  }
}
