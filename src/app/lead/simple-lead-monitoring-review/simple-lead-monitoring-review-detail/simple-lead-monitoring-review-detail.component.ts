import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { UploadReviewCustomObj } from 'app/shared/model/v2/upload-review-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { WorkflowApiObj } from 'app/shared/model/workflow/workflow-api-obj.model';

@Component({
  selector: 'app-simple-lead-monitoring-review-detail',
  templateUrl: './simple-lead-monitoring-review-detail.component.html',
  styleUrls: ['./simple-lead-monitoring-review-detail.component.scss']
})
export class SimpleLeadMonitoringReviewDetailComponent implements OnInit {

  inputPagingObj: UcPagingObj;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  UploadMonitoringHId: number;
  UploadNo: string;
  taskListId: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private claimTaskService: ClaimTaskService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params["UploadMonitoringHId"] != null) {
        this.UploadMonitoringHId = params["UploadMonitoringHId"];
      }
      if (params["UploadNo"] != null) {
        this.UploadNo = params["UploadNo"];
      }
      if (params["TaskListId"] != null) {
        this.taskListId = params["TaskListId"];
      }
    });
  }

  ngOnInit() {
    this.claimTask();
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewReviewMonitoringLead.json";

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchReviewMonitoringLeadDetail.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReviewMonitoringLeadDetail.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "UL.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      },
      {
        name: "UL.MR_CUST_MODEL_CODE",
        environment: environment.FoundationR3Url + "/v1"
      },
      {
        name: "UL.LOB_CODE",
        environment: environment.FoundationR3Url + "/v1"
      }
    ];

    let arrCrit = new Array<CriteriaObj>();
    let critObj = new CriteriaObj();
    critObj.DataType = 'test';
    critObj.propName = 'UL.UPLOAD_MONITORING_NO';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = this.UploadNo;
    arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = arrCrit;
  }

  Cancel() {
    let CancelUrl = environment.isCore? URLConstant.CancelUploadV2 : URLConstant.CancelUpload;
    var wfObj = new WorkflowApiObj();
    wfObj.TransactionNo = this.UploadNo;
    wfObj.ListValue["Status"] = "RJC";
    wfObj.ListValue["WfCode"] = CommonConstant.WF_UPL_SMPL_LEAD;
    wfObj.ListValue["TaskId"] = this.taskListId;
    this.http.post(CancelUrl, wfObj).subscribe(
      response => {
        this.toastr.successMessage(response["Message"]);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.SIMPLE_LEAD_RVW_MONITORING_PAGING],{});
      }); 
      }
    );
  }

  uploadReview(status : string) {
    let UploadReviewUrl = environment.isCore? URLConstant.UploadReviewV2 : URLConstant.UploadReview;

    var uploadObj = new UploadReviewCustomObj();
    uploadObj.TaskListId = this.taskListId;
    uploadObj.MrUploadStatusCode = status;
    uploadObj.UploadMonitoringNo = this.UploadNo;

    this.http.post(UploadReviewUrl, uploadObj).subscribe(
      response => {
        this.toastr.successMessage(response["Message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.SIMPLE_LEAD_RVW_MONITORING_PAGING], {});
      }
    );   
  }

  claimTask() {
    if(environment.isCore){	
        if(this.taskListId!= "" && this.taskListId!= undefined){	
            this.claimTaskService.ClaimTaskV2(this.taskListId);	
        }	
    }	
    else if (this.taskListId> 0) {	
        this.claimTaskService.ClaimTask(this.taskListId);	
    }
}

}
