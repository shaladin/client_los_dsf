import { Component, OnInit } from '@angular/core';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { String } from 'typescript-string-operations';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { environment } from 'environments/environment';


@Component({
  selector: 'cessie-pre-go-live-approval-paging',
  templateUrl: './pre-go-live-approval-paging.component.html'
})
export class CessiePreGoLiveApprovalPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));


  constructor(private route: ActivatedRoute,
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private router: Router, private cookieService: CookieService) {
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCessiePreGoLiveApproval.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCessiePreGoLiveApproval.json";
    this.inputPagingObj.addCritInput = new Array();

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/searchCessiePreGoLiveApprovalV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCessiePreGoLiveApprovalV2.json";
    }

    var critInputOnlyOffering = new CriteriaObj();
    critInputOnlyOffering.propName = "vApv.CATEGORY_CODE";
    critInputOnlyOffering.restriction = AdInsConstant.RestrictionEq;
    critInputOnlyOffering.value = CommonConstantX.CESSIE_PRE_GPV_APV_CATEGORY;
    this.inputPagingObj.addCritInput.push(critInputOnlyOffering);

    var critCurrentUser = new CriteriaObj();
    critCurrentUser.DataType = 'text';
    critCurrentUser.restriction = AdInsConstant.RestrictionEq;
    critCurrentUser.propName = 'vApv.CURRENT_USER_ID';
    critCurrentUser.value = this.userContext.UserName;
    this.inputPagingObj.addCritInput.push(critCurrentUser);

    var critMainUser = new CriteriaObj();
    critMainUser.DataType = 'text';
    critMainUser.restriction = AdInsConstant.RestrictionOr;
    critMainUser.propName = 'vApv.MAIN_USER_ID';
    critMainUser.value = this.userContext.UserName;
    this.inputPagingObj.addCritInput.push(critMainUser);

  }

  GetCallBack(ev: any) {
    var ApvReqObj = new ApprovalObj();
    if (ev.Key == "Process") {
      if (String.Format("{0:L}", ev.RowObj.CurrentUserId) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
      } else {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.CESSIE_PGL_APPRVL_DETAIL],{ "CessieHXId": ev.RowObj.CessieHXId, "AppId": ev.RowObj.AppId, "TrxNo": ev.RowObj.TrxNo, "TaskId" : ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "ApvReqId": ev.RowObj.ApvReqId, "mrCustTypeCode": ev.RowObj.MrCustTypeCode });
      }
    }
    else if (ev.Key == "HoldTask") {
      if (String.Format("{0:L}", ev.RowObj.CurrentUserId) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId
        this.httpClient.post(URLConstant.ApvHoldTaskUrl, ApvReqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["Message"]);
          }
        )
      }
    }
    else if (ev.Key == "TakeBack") {
      if (String.Format("{0:L}", ev.RowObj.MainUserId) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_TAKE_BACK);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId;
        ApvReqObj.Username = ev.RowObj.MainUserId;
        this.httpClient.post(URLConstant.ApvTakeBackTaskUrl, ApvReqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["Message"]);
          }
        )
      }
    }
    else {
      this.toastr.warningMessage(String.Format(ExceptionConstant.ERROR_NO_CALLBACK_SETTING, ev.Key));
    }
  }

}
