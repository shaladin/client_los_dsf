import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-lead-monitoring-review-detail',
  templateUrl: './lead-monitoring-review-detail.component.html',
  styles: []
})
export class LeadMonitoringReviewDetailComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  viewUpload: string;
  UploadMonitoringHId: number;
  UploadNo: string;
  taskListId: number;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private toastr: NGXToastrService
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
    this.viewUpload = "./assets/ucviewgeneric/viewReviewMonitoringLead.json";
  }

  ngOnInit() {
    this.claimTask();
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchReviewMonitoringLeadDetail.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReviewMonitoringLeadDetail.json";
    var arrCrit = new Array<CriteriaObj>();
    var critObj = new CriteriaObj();
    critObj.DataType = 'test';
    critObj.propName = 'UL.UPLOAD_MONITORING_NO';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = this.UploadNo;
    arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = arrCrit;
  }

  uploadReview(status) {
    var uploadObj = {
      MrUploadStatusCode: status,
      TaskListId: this.taskListId,
      UploadMonitoringNo: this.UploadNo
    };
    this.http.post(AdInsConstant.UploadReview, uploadObj).subscribe(
      response => {
        this.toastr.successMessage(response["Message"]);
        this.router.navigate(["/Lead/ReviewMonitoring/Paging"]);
      },
      error => {
        console.log(error);
      }
    );
  }

  claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = { pWFTaskListID: this.taskListId, pUserID: currentUserContext["UserName"] };
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {}
    );
  }

}
