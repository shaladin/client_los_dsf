import { Component, OnInit } from '@angular/core';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
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


@Component({
  selector: 'app-doc-checklist-approval-paging',
  templateUrl: './doc-checklist-approval-paging.component.html'
})
export class DocChecklistApprovalPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  BizTemplateCode: string;
  token: any = localStorage.getItem(CommonConstant.TOKEN);
  userContext: CurrentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));


  constructor(private route: ActivatedRoute,
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode",this.BizTemplateCode);
      }
    }); 
   }

  ngOnInit() {

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchDocChecklistApproval.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchDocChecklistApproval.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "app.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.inputPagingObj.addCritInput = new Array();

    var critInputOnlyOffering = new CriteriaObj();
    critInputOnlyOffering.propName = "vApv.CATEGORY_CODE";
    critInputOnlyOffering.restriction = AdInsConstant.RestrictionEq;
    critInputOnlyOffering.value = "DOC_CHCKLIST_APV";
    this.inputPagingObj.addCritInput.push(critInputOnlyOffering);

    var critBizTemplate = new CriteriaObj();
    critBizTemplate.restriction = AdInsConstant.RestrictionEq;
    critBizTemplate.propName = 'app.BIZ_TEMPLATE_CODE';
    critBizTemplate.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critBizTemplate);

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
    if(ev.Key == "Process"){
      if (String.Format("{0:L}", ev.RowObj.CurrentUserId) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
      } else {
        AdInsHelper.RedirectUrl(this.router, ["/Nap/AdminProcess/DocChecklist/Approval/Detail"],{ "AppId": ev.RowObj.AppId, "TrxNo": ev.RowObj.TrxNo, "TaskId" : ev.RowObj.TaskId, "InstanceId": ev.RowObj.InstanceId, "ApvReqId": ev.RowObj.ApvReqId });
      }
    }    
    else if (ev.Key == "HoldTask") {
      if (String.Format("{0:L}", ev.RowObj.CurrentUserId) != String.Format("{0:L}", this.userContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
      }else {
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
        ApvReqObj.TaskId = ev.RowObj.TaskId
        this.httpClient.post(URLConstant.ApvTakeBackTaskUrl, ApvReqObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["Message"]);
          }
        )
      }
    }
    else if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
    else {
      this.toastr.errorMessage(String.Format(ExceptionConstant.ERROR_NO_CALLBACK_SETTING, ev.Key));
    }
  }

}
