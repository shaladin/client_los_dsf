import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { String } from 'typescript-string-operations';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
@Component({
  selector: 'app-ltkm-approval-paging',
  templateUrl: './ltkm-approval-paging.component.html',
  providers: [NGXToastrService]
})
export class LtkmApprovalPagingComponent implements OnInit {
  arrCrit: Array<CriteriaObj>;
  token: any = localStorage.getItem(CommonConstant.TOKEN);
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  inputPagingObj: UcPagingObj = new UcPagingObj();
  constructor(
    private route: ActivatedRoute, 
    private toastr: NGXToastrService, 
    private httpClient: HttpClient, 
    private router: Router,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
     
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchLtkmApproval.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLtkmApproval.json";

    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    
    var arrCrit = new Array();
    var critObj = new CriteriaObj();

    critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'ATL.CURRENT_USER_ID';
    critObj.value = this.userContext.UserName;
    arrCrit.push(critObj);

    critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionOr;
    critObj.propName = 'ATL.MAIN_USER_ID';
    critObj.value = this.userContext.UserName;
    arrCrit.push(critObj);

    this.inputPagingObj.addCritInput = arrCrit;
  }
  GetCallBack(ev: any) {
    var ApvReqObj = new ApprovalObj();
    if (ev.Key == "ltkmno") { 
        AdInsHelper.OpenLtkmViewByLtkmCustId(ev.RowObj.LtkmCustId);
    }
    else if(ev.Key == "Process"){
      if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
      } else {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.LTKM_VERIFY_APV_DETAIL],{ "LtkmCustId": ev.RowObj.LtkmCustId, "LtkmNo": ev.RowObj.LtkmNo, "TaskId" : ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "MrCustTypeCode": ev.RowObj.MrCustTypeCode, "ApvReqId": ev.RowObj.ApvReqId, "WfTaskListId": ev.RowObj.WfTaskListId });
      }
    }
    else if (ev.Key == "HoldTask") {
      if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId;
        this.httpClient.post(URLConstant.ApvHoldTaskUrl, ApvReqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["Message"]);
          }
        )
      }
    }
    else if (ev.Key == "TakeBack") {
      if (String.Format("{0:L}", ev.RowObj.MainUser) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_TAKE_BACK);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId;
        ApvReqObj.UsernameMemberId = ev.RowObj.MainUsernameMemberId;
        this.httpClient.post(URLConstant.ApvTakeBackTaskUrl, ApvReqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["Message"]);
          }
        )
      }
    }
    else {
      this.toastr.errorMessage(String.Format(ExceptionConstant.ERROR_NO_CALLBACK_SETTING, ev.Key));
    }
  }

}
