import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";

@Injectable({
    providedIn: 'root'
})
export class RegexService {
    constructor(private http: HttpClient) { }

    getErrMessage(pattern: string): any {
        let errMessage: string = "";
        //NOTE : FORMAT ERROR MESSAGE => ID TYPENYA APA - PESAN ERRORNYA APA
        switch (pattern) {
          case "^[0-9]{16}$":
            errMessage = 'must be numeric and 16 characters';
            break;
          case "^\\d{0,20}$":
            errMessage = 'must be numeric and between 20 characters';
            break;
          default:
            errMessage = 'Not yet setting';
            break;
        }
        return errMessage;
      }

    getListPattern(): Observable<Object> {
        var RefMasterPatternCode = {
          RefMasterTypeCode: CommonConstant.RefMasterTypeCodeRegularExpression,
          MappingCode: null
        }
        return this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, RefMasterPatternCode);
    }
}