import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { UcpagingModule } from '@adins/ucpaging';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { environment } from 'environments/environment';
import { String } from 'typescript-string-operations';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-mou-unfreeze-apv-paging',
  templateUrl: './mou-unfreeze-apv-paging.component.html'
})
export class MouUnfreezeApvPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<CriteriaObj>;
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(
    private toastr: NGXToastrService, 
    private httpClient: HttpClient, 
    private router: Router,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchMouFeezeUnfreezeApvPaging.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchMouFeezeUnfreezeApvPaging.json";

    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'CATEGORY_CODE';
    critObj.value = 'MOU_FREEZE_UNFREEZE';
    this.arrCrit.push(critObj);

    critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'CURRENT_USER_ID';
    critObj.value = this.userContext.UserName;
    this.arrCrit.push(critObj);


    critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionOr;
    critObj.propName = 'MAIN_USER_ID';
    critObj.value = this.userContext.UserName;
    this.arrCrit.push(critObj);

    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  CallBackHandler(ev) {
    var ApvReqObj = new ApprovalObj();
    if (ev.Key == "Process") {
      if (String.Format("{0:L}", ev.RowObj.CURRENT_USER_ID) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
      } else {
        this.router.navigate([NavigationConstant.MOU_FREEZE_APV_DETAIL], { queryParams: { "MouCustId":ev.RowObj.MouCustId,"TrxId": ev.RowObj.TrxId, "TrxNo": ev.RowObj.TrxNo, "TaskId": ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "ApvReqId": ev.RowObj.ApvReqId } });
      }
    }
    else if (ev.Key == "HoldTask") {
      if (String.Format("{0:L}", ev.RowObj.CURRENT_USER_ID) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId
        this.httpClient.post(AdInsConstant.ApvHoldTaskUrl, ApvReqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["Message"]);
          }
        )
      }
    }
    else if (ev.Key == "TakeBack") {
      if (String.Format("{0:L}", ev.RowObj.MAIN_USER_ID) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_TAKE_BACK);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId;
        ApvReqObj.UsernameMemberId = ev.RowObj.MainUsernameMemberId;
        this.httpClient.post(AdInsConstant.ApvTakeBackTaskUrl, ApvReqObj).subscribe(
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
