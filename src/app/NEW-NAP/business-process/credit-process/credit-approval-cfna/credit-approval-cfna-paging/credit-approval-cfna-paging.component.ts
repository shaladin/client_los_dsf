import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { String } from 'typescript-string-operations';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-credit-approval-cfna-paging',
  templateUrl: './credit-approval-cfna-paging.component.html',
  styleUrls: []
})
export class CreditApprovalCfnaPagingComponent implements OnInit {
  BizTemplateCode: string;
  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj>;
  token: any = localStorage.getItem(CommonConstant.TOKEN);
  userContext: CurrentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
  
  constructor(private route: ActivatedRoute, private toastr: NGXToastrService, private httpClient: HttpClient, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchCreditApprovalCFNA.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditApprovalCFNA.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'RL.BIZ_TMPLT_CODE';
    critObj.value = this.BizTemplateCode;
    arrCrit.push(critObj);

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
    if (ev.Key == "ViewProdOffering") { 
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
    else if(ev.Key == "Process"){
      if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
      } else {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_CRD_APPRV_CFNA_DETAIL],{ "AppId": ev.RowObj.AppId, "TaskId" : ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "MrCustTypeCode": ev.RowObj.MrCustTypeCode, "ApvReqId": ev.RowObj.ApvReqId  });
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
        ApvReqObj.TaskId = ev.RowObj.TaskId
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
