import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { WorkflowApiObj, WorkflowApiV2Obj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router } from '@angular/router';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';

@Component({
  selector: 'app-lead-monitoring-review',
  templateUrl: './lead-monitoring-review.component.html',
  styles: []
})
export class LeadMonitoringReviewComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  requestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();

  constructor(private httpClient: HttpClient, private toastr: NGXToastrService, private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.inputPagingObj._url = "./assets/ucpaging/searchReviewUploadLead.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReviewUploadLead.json";
    this.inputPagingObj.enviromentUrl = environment.FoundationR3Url + "/v1";

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchReviewUploadLeadV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchReviewUploadLeadV2.json";
      this.inputPagingObj.enviromentUrl = environment.FoundationR3Url + "/v1";

      this.inputPagingObj.isJoinExAPI = true;

      this.requestTaskModel.ProcessKey = CommonConstant.WF_UPL_LEAD,
      this.requestTaskModel.OfficeCode = UserAccess[CommonConstant.OFFICE_CODE],
      this.requestTaskModel.TaskDefinitionKey = CommonConstant.UPLOAD_LEAD_REVIEW,
      this.requestTaskModel.RoleCode = UserAccess[CommonConstant.ROLE_CODE],
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.requestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "UploadNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.IntegrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
  }

  cancel(ev) {
    if(environment.isCore){
      let newWfObj = new WorkflowApiV2Obj();
      newWfObj.TaskListId = ev.RowObj.ExecutionId;
      newWfObj.TransactionNo = ev.RowObj.UploadNo;
      newWfObj.ListValue = { "Status": "RJC" };
      this.httpClient.post(URLConstant.CancelUploadV2, newWfObj).subscribe(
        response => {
          this.toastr.successMessage(response["Message"]);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_RVW_MONITORING_PAGING], {});
          });
        }
      );
    }
    else{
      let wfObj = new WorkflowApiObj();
      wfObj.TaskListId = ev.RowObj.TaskListId;
      wfObj.TransactionNo = ev.RowObj.UploadNo;
      wfObj.ListValue = { "Status": "RJC" };
      this.httpClient.post(URLConstant.CancelUpload, wfObj).subscribe(
        response => {
          this.toastr.successMessage(response["Message"]);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_RVW_MONITORING_PAGING], {});
          });
        }
      );
    }
  }
 
}
