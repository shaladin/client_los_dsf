
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie";
import { AdInsHelper } from "./AdInsHelper";
import { CommonConstant } from "./constant/CommonConstant";
import { URLConstant } from "./constant/URLConstant";
import { AppObj } from "./model/app/app.model";
import { ClaimWorkflowObj } from "./model/workflow/claim-workflow-obj.model";
import { ClaimTaskModel } from "./model/workflow/v2/claim-task-model-obj.model";
import { AdInsConstant } from "./AdInstConstant";
import { ReqSubmitNAPDataObj } from "./model/app/req-submit-nap-data-v2-obj.model";

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
  
  ClaimTaskNapCustMainDataV2(AppId: number, WfTaskListId: string){
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let wfClaimObj = new ReqSubmitNAPDataObj();
    wfClaimObj.AppId = AppId;
    wfClaimObj.WfTaskListId = WfTaskListId;
    wfClaimObj.Username = currentUserContext[CommonConstant.USER_NAME];

    this.http.post(URLConstant.ClaimTaskNapCustmainDataV2, wfClaimObj).subscribe(
      () => {
      });
  }  

  ClaimTaskV2(WfTaskListId: string){
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let ClaimTaskObj: ClaimTaskModel = new ClaimTaskModel();
    ClaimTaskObj.TaskId = WfTaskListId;
    ClaimTaskObj.UserId = currentUserContext[CommonConstant.USER_NAME];
    this.http.post(URLConstant.ClaimTaskV2, ClaimTaskObj).subscribe(
      () => {
      });
  }

  ClaimTaskSelfVerifV2(WfTaskListId: string){
    let ClaimTaskObj: ClaimTaskModel = new ClaimTaskModel();
    ClaimTaskObj.TaskId = WfTaskListId;
    ClaimTaskObj.UserId = AdInsConstant.UserCustomer;
    this.http.post(URLConstant.ClaimTaskV2, ClaimTaskObj).subscribe(
      () => {
      });
  }

  ClaimTaskSelfVerif(WfTaskListId: number){
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = WfTaskListId.toString();
    wfClaimObj.pUserID = AdInsConstant.UserCustomer;
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
      });
  }
}