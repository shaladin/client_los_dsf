import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { CookieService } from "ngx-cookie";
import { AdInsHelper } from "../AdInsHelper";
import { AdInsConstant } from "../AdInstConstant";
import { CommonConstant } from "../constant/CommonConstant";
import { ApprovalObj } from "../model/approval/approval-obj.model";
import { ApvClaimTaskObj } from "../model/approval/approval-req-obj.model";

@Injectable()
export class ApprovalTaskService{

    constructor(private http: HttpClient, private cookieService: CookieService, private toastr: NGXToastrService) { }
  
    async ClaimApvTask(TaskId: number){
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        var claimTaskObj = new ApvClaimTaskObj();
        claimTaskObj.TaskId = TaskId;
        claimTaskObj.Username = currentUserContext[CommonConstant.USER_NAME];
        await this.http.post(AdInsConstant.ApvClaimTask, claimTaskObj).toPromise().then(
            (response) => {
                if (response["StatusCode"] != 200) {
                    this.toastr.errorMessage(response["Message"]);
                }
            }
        );
    }

    HoldApvTask(TaskId: number){
        let ApvReqObj = new ApprovalObj();
        ApvReqObj.TaskId = TaskId;
        this.http.post(AdInsConstant.ApvHoldTaskUrl, ApvReqObj).subscribe(
            (response) => {
                this.toastr.successMessage(response["Message"]);
            }
        );
    }

    TakeBackApvTask(TaskId: number, Username: string){
        let ApvReqObj = new ApprovalObj();
        ApvReqObj.TaskId = TaskId;
        ApvReqObj.Username = Username;
        this.http.post(AdInsConstant.ApvTakeBackTaskUrl, ApvReqObj).subscribe(
            (response) => {
               this.toastr.successMessage(response["Message"]);
            }
        );
    }
    
    UnclaimApvTask(TaskId: number){
        let ApvReqObj = new ApprovalObj();
        ApvReqObj.TaskId = TaskId;
        this.http.post(AdInsConstant.ApvUnclaimTaskUrl, ApvReqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["Message"]);
          }
        )
    }
  }