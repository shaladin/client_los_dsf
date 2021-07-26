
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie";
import { AdInsHelper } from "./AdInsHelper";
import { CommonConstant } from "./constant/CommonConstant";
import { URLConstant } from "./constant/URLConstant";
import { AppObj } from "./model/App/App.Model";
import { ClaimWorkflowObj } from "./model/Workflow/ClaimWorkflowObj.Model";

@Injectable()
export class ClaimTaskService{

  constructor(
    private http: HttpClient,
    private cookieService: CookieService) { }


  ClaimTask(WfTaskListId: number){
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = WfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
      });
  }

  ClaimTaskNapCustMainData(AppId: number, WfTaskListId: number){
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = new AppObj();
    wfClaimObj.AppId = AppId;
    wfClaimObj.Username = currentUserContext[CommonConstant.USER_NAME];
    wfClaimObj.WfTaskListId = WfTaskListId;

    this.http.post(URLConstant.ClaimTaskNapCustmainData, wfClaimObj).subscribe(
      () => {
      });
  }
}