import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.Model';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { String } from 'typescript-string-operations';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { Router } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
@Component({
  selector: 'app-prod-offering-apv-paging',
  templateUrl: './prod-offering-apv-paging.component.html'
})
export class ProdOfferingApvPagingComponent implements OnInit {

  InputPagingObj: UcPagingObj = new UcPagingObj();
  ArrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  UserContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(private toastr: NGXToastrService, 
              private http: HttpClient, 
              private router: Router, 
              private cookieService: CookieService) { }

  ngOnInit() {
    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductOfferingApproval.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductOfferingApproval.json";

    let critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'CATEGORY_CODE';
    critObj.value = 'PRD_OFR_APV';
    this.ArrCrit.push(critObj);

    critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'CURRENT_USER_ID';
    critObj.value = this.UserContext.UserName;
    this.ArrCrit.push(critObj);
    
    critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionOr;
    critObj.propName = 'MAIN_USER_ID';
    critObj.value = this.UserContext.UserName;
    this.ArrCrit.push(critObj);

    this.InputPagingObj.addCritInput = this.ArrCrit;
  }

  CallBackHandler(ev) {
    let ApvReqObj = new ApprovalObj();
    if (ev.Key == "Process") {
      if (String.Format("{0:L}", ev.RowObj.CURRENT_USER_ID) != String.Format("{0:L}", this.UserContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
      } else {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_OFFERING_APPRV_DETAIL],{ "ProdOfferingHId": ev.RowObj.ProdOfferingHId, "TaskId" : ev.RowObj.TaskId, "ApvReqId": ev.RowObj.ApvReqId});
      }
    }
    else if (ev.Key == "HoldTask") {
      ApvReqObj.TaskId = ev.RowObj.TaskId
      this.http.post(AdInsConstant.ApvHoldTaskUrl, ApvReqObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
        }
      )
    }
    else if (ev.Key == "TakeBack") {
      if (String.Format("{0:L}", ev.RowObj.MAIN_USER_ID) != String.Format("{0:L}", this.UserContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_TAKE_BACK);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId
        this.http.post(AdInsConstant.ApvTakeBackTaskUrl, ApvReqObj).subscribe(
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
