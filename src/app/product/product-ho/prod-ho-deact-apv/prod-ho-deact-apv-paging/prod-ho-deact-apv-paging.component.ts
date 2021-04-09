import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { String } from 'typescript-string-operations';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
@Component({
  selector: 'app-prod-ho-deact-apv-paging',
  templateUrl: './prod-ho-deact-apv-paging.component.html'
})
export class ProdHoDeactApvPagingComponent implements OnInit {

  inputPagingObj: any;
  arrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(private toastr: NGXToastrService, private httpClient: HttpClient, private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/product/searchProductHODeactApv.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHODeactApv.json";

    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'CATEGORY_CODE';
    critObj.value = 'PRD_HO_DEACT_APV';
    this.arrCrit.push(critObj);

    critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'PROD_STAT';
    critObj.value = CommonConstant.ProdStatReqDeact;
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
    if(ev.Key == "Process"){
      if (String.Format("{0:L}", ev.RowObj.CURRENT_USER_ID) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
      } else {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_DEACTIVATE_APPRV_DETAIL],{ "ProdHId": ev.RowObj.ProdHId, "TaskId" : ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "ApvReqId": ev.RowObj.ApvReqId  });
      }
    }
    else if (ev.Key == "HoldTask") {
      ApvReqObj.TaskId = ev.RowObj.TaskId
      this.httpClient.post(AdInsConstant.ApvHoldTaskUrl, ApvReqObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
        }
      )
    }
    else if (ev.Key == "TakeBack") {
      if (String.Format("{0:L}", ev.RowObj.MAIN_USER_ID) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_TAKE_BACK);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId
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
