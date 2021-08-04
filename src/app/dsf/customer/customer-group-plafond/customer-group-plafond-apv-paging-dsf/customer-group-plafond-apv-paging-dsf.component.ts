import { Component, OnInit, ViewChild } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstantDsf } from 'app/dsf/shared/constant/CommonConstantDsf';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { String } from 'typescript-string-operations';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-customer-group-plafond-apv-paging-dsf',
  templateUrl: './customer-group-plafond-apv-paging-dsf.component.html',
  styleUrls: ['./customer-group-plafond-apv-paging-dsf.component.css'],
  providers: [NGXToastrService]
})
export class CustomerGroupPlafondApvPagingDsfComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: any;
  UserContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService,CommonConstant.USER_ACCESS));
  constructor(private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder,private cookieService: CookieService) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/dsf/ucpaging/searchCustomegGroupPlafondApproval.json";
    this.inputPagingObj.pagingJson = "./assets/dsf/ucpaging/searchCustomegGroupPlafondApproval.json";

    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'CATEGORY_CODE';
    critObj.value = CommonConstantDsf.CAT_CODE_CUST_GRP_PLAFOND_APV;
    this.arrCrit.push(critObj);

    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'CURRENT_USER_ID';
    critObj.value = this.UserContext.UserName;
    this.arrCrit.push(critObj);

    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'MAIN_USER_ID';
    critObj.value = this.UserContext.UserName;
    this.arrCrit.push(critObj);

    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  CallBackHandler(ev) {
    var ApvReqObj = new ApprovalObj();
    if (ev.Key == "Process") {
      if (String.Format("{0:L}", ev.RowObj.CURRENT_USER_ID) != String.Format("{0:L}", this.UserContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
      } else {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.CUSTOMER_GROUP_PLAFOND_APPROVAL_DETAIL],{ "CustGrpPlafondId": ev.RowObj.CUST_GRP_PLFND_ID,"CustGrpNo": ev.RowObj.CUST_GRP_NO, "TaskId": ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "ApvReqId": ev.RowObj.ApvReqId , "TrxNo": ev.RowObj.TRX_NO });
      }
    }
    else if (ev.Key == "HoldTask") {
      if (String.Format("{0:L}", ev.RowObj.CURRENT_USER_ID) != String.Format("{0:L}", this.UserContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
      } else {
        ApvReqObj.TaskId = ev.RowObj.TaskId
        this.http.post(AdInsConstant.ApvHoldTaskUrl, ApvReqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["Message"]);
          }
        )
      }
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
