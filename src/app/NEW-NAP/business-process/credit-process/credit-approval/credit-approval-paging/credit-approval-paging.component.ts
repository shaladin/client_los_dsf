import { Component, OnInit, Input } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { String } from 'typescript-string-operations';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';

@Component({
  selector: 'app-credit-approval-paging',
  templateUrl: './credit-approval-paging.component.html',
  providers: [NGXToastrService]
})
export class CreditApprovalPagingComponent implements OnInit {
  BizTemplateCode: string;
  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj>;
  token: any = localStorage.getItem("Token");
  userContext: CurrentUserContext = JSON.parse(localStorage.getItem(AdInsConstant.USER_ACCESS));
  
  constructor(private route: ActivatedRoute, private toastr: NGXToastrService, private httpClient: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchCreditApproval.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditApproval.json";

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
    this.inputPagingObj.addCritInput = arrCrit;
  }
  GetCallBack(ev: any) {
    var ApvReqObj = new ApprovalObj();
    if (ev.Key == "ViewProdOffering") {
      var link = environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=0&prodOfferingCode=" + ev.RowObj.prodOfferingCode + "&prodOfferingVersion=" + ev.RowObj.prodOfferingVersion + "&Token=" + this.token;
      window.open(link, '_blank');
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
      if (String.Format("{0:L}", ev.RowObj.CurrentUserId) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(AdInsConstant.NOT_ELIGIBLE_FOR_TAKE_BACK);
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
      this.toastr.errorMessage(String.Format(AdInsConstant.ERROR_NO_CALLBACK_SETTING, ev.Key));
    }
  }
}
