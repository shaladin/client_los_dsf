import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { String } from 'typescript-string-operations';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';

@Component({
  selector: 'app-offering-validity-checking-approval-paging',
  templateUrl: './offering-validity-checking-approval-paging.component.html',
  styleUrls: []
})
export class OfferingValidityCheckingApprovalPagingComponent implements OnInit {
  BizTemplateCode: string;
  inputPagingObj: any;
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

    var critInputOnlyOffering = new CriteriaObj();
    critInputOnlyOffering.propName = "vApv.CATEGORY_CODE";
    critInputOnlyOffering.restriction = AdInsConstant.RestrictionEq;
    critInputOnlyOffering.value = AdInsConstant.OFFERING_VALIDITY_APV;

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchOfferingValidityCheckingAndApproval.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchOfferingValidityCheckingAndApproval.json";
    this.inputPagingObj.addCritInput = new Array();
    this.inputPagingObj.addCritInput.push(critInputOnlyOffering);

    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'agr.BIZ_TEMPLATE_CODE';
    critObj.value = this.BizTemplateCode;
    arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = arrCrit;

  }

  CallbackHandler(ev: any) {
    console.log("AWAW");
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
