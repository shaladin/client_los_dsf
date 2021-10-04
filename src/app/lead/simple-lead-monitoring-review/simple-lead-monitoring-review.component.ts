import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router } from '@angular/router';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-simple-lead-monitoring-review',
  templateUrl: './simple-lead-monitoring-review.component.html',
  styleUrls: ['./simple-lead-monitoring-review.component.scss']
})
export class SimpleLeadMonitoringReviewComponent implements OnInit {
  inputPagingObj: UcPagingObj
  requestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();

  constructor(private httpClient: HttpClient, private toastr: NGXToastrService, private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchReviewUploadSimpleLead.json";
    this.inputPagingObj.enviromentUrl = environment.FoundationR3Url + "/v1";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReviewUploadSimpleLead.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "UMH.OFFICE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      }
    ];

    if(environment.isCore){
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchReviewUploadSimpleLeadV2.json";
      this.inputPagingObj.enviromentUrl = environment.FoundationR3Url + "/v1";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchReviewUploadSimpleLeadV2.json";
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "UMH.OFFICE_CODE",
          environment: environment.FoundationR3Url + "/v1"
        }
      ];

      this.inputPagingObj.isJoinExAPI = true;

      this.requestTaskModel.ProcessKey = CommonConstant.WF_UPL_SMPL_LEAD;
      this.requestTaskModel.TaskDefinitionKey = CommonConstant.UPLOAD_SMPL_LEAD_REVIEW;
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
    let urlPost = environment.isCore? URLConstant.CancelUploadV2 : URLConstant.CancelUpload;
    let tempTaskListId = environment.isCore? ev.RowObj.ExecutionId : ev.RowObj.TaskListId;
    let wfObj = new WorkflowApiObj();
    wfObj.TaskListId = tempTaskListId;
    wfObj.TransactionNo = ev.RowObj.UploadNo;
    wfObj.ListValue = { "Status": "RJC" };
    this.httpClient.post(urlPost, wfObj).subscribe(
      response => {
        this.toastr.successMessage(response["Message"]);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.SIMPLE_LEAD_RVW_MONITORING_PAGING], {});
        });
      }
    );
  }  

}
