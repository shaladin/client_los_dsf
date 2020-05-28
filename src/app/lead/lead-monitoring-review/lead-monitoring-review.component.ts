import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router } from '@angular/router';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';

@Component({
  selector: 'app-lead-monitoring-review',
  templateUrl: './lead-monitoring-review.component.html',
  styles: []
})
export class LeadMonitoringReviewComponent implements OnInit {
  inputPagingObj: UcPagingObj

  constructor(private httpClient: HttpClient, private toastr: NGXToastrService, private router: Router) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchReviewUploadLead.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReviewUploadLead.json";
  }

  cancel(ev) {
    var wfObj = new WorkflowApiObj();
    wfObj.TaskListId = ev.TaskListId;
    wfObj.TransactionNo = ev.UploadNo;
    wfObj.ListValue = { "Status": "CAN" };
    this.httpClient.post(AdInsConstant.CancelUpload, wfObj).subscribe(
      response => {
        this.toastr.successMessage(response["Message"]);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/Lead/ReviewMonitoring/Paging']);
      }); 
      },
      error => {
        console.log(error);
      }
    );
  }

}
