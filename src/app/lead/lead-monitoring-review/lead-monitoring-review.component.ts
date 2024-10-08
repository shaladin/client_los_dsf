import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { WorkflowApiObj } from 'app/shared/model/workflow/workflow-api-obj.model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router } from '@angular/router';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';

@Component({
  selector: 'app-lead-monitoring-review',
  templateUrl: './lead-monitoring-review.component.html',
  styles: []
})
export class LeadMonitoringReviewComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  requestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();

  constructor(private httpClient: HttpClient, private toastr: NGXToastrService, private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.inputPagingObj._url = "./assets/ucpaging/searchReviewUploadLead.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReviewUploadLead.json";
    this.inputPagingObj.enviromentUrl = environment.FoundationR3Url + "/v1";

    if (environment.isCore) {
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchReviewUploadLeadV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchReviewUploadLeadV2.json";
      this.inputPagingObj.enviromentUrl = environment.FoundationR3Url + "/v1";

      this.inputPagingObj.isJoinExAPI = true;

      this.requestTaskModel.ProcessKey = CommonConstant.WF_UPL_LEAD;
      this.requestTaskModel.TaskDefinitionKey = CommonConstant.UPLOAD_LEAD_REVIEW;
      this.requestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE], 
                                               UserAccess[CommonConstant.OFFICE_CODE],
                                               UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE]];

      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.requestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "UploadNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.IntegrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
  }

  cancel(ev) {
    let wfObj = new WorkflowApiObj();
    wfObj.TaskListId = environment.isCore ? ev.RowObj.ProcessInstanceId : ev.RowObj.TaskListId;
    wfObj.TransactionNo = ev.RowObj.UploadNo;
    wfObj.ListValue = { "Status": "RJC" };

    let CancelUploadUrl = environment.isCore ? URLConstant.CancelUploadV2 : URLConstant.CancelUpload;
    this.httpClient.post(CancelUploadUrl, wfObj).subscribe(
      response => {
        this.toastr.successMessage(response["Message"]);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_RVW_MONITORING_PAGING], {});
        });
      }
    );
  }
}
