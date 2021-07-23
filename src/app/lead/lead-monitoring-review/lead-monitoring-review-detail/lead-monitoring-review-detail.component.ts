import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UploadReviewCustomV2Obj } from 'app/shared/model/V2/UploadReviewObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';

@Component({
  selector: 'app-lead-monitoring-review-detail',
  templateUrl: './lead-monitoring-review-detail.component.html',
  styles: []
})
export class LeadMonitoringReviewDetailComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  UploadMonitoringHId: number;
  UploadNo: string;
  taskListId: any;
  currentUserContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  readonly BackLink: string = NavigationConstant.LEAD_RVW_MONITORING_PAGING;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService, 
    private cookieService: CookieService,
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

    this.inputPagingObj._url = "./assets/ucpaging/searchReviewMonitoringLeadDetail.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReviewMonitoringLeadDetail.json";

    let arrCrit = new Array<CriteriaObj>();
    let critObj = new CriteriaObj();
    critObj.DataType = 'test';
    critObj.propName = 'UL.UPLOAD_MONITORING_NO';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = this.UploadNo;
    arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = arrCrit;
  }

  uploadReview(status : string) {
    if(environment.isCore){
      let uploadObj = {
        MrUploadStatusCode: status,
        TaskListId: this.taskListId,
        UploadMonitoringNo: this.UploadNo
      };

      var uploadV2Obj = new UploadReviewCustomV2Obj();
      uploadV2Obj.TaskListId = this.taskListId;
      uploadV2Obj.MrUploadStatusCode = status;
      uploadV2Obj.UploadMonitoringNo = this.UploadNo;

      this.http.post(URLConstant.UploadReviewV2, uploadV2Obj).subscribe(
        response => {
          this.toastr.successMessage(response["Message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_RVW_MONITORING_PAGING], {});
        }
      );
    }
    else{
      let uploadObj = {
        MrUploadStatusCode: status,
        TaskListId: this.taskListId,
        UploadMonitoringNo: this.UploadNo
      };
      this.http.post(URLConstant.UploadReview, uploadObj).subscribe(
        response => {
          this.toastr.successMessage(response["Message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_RVW_MONITORING_PAGING], {});
        }
      );
    }
  }

  claimTask() {
    if(environment.isCore){
      this.claimTaskService.ClaimTaskV2(this.taskListId);
    }
    else{
      this.claimTaskService.ClaimTask(this.taskListId);
    }
  }
}
