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

@Component({
  selector: 'app-lead-monitoring-review',
  templateUrl: './lead-monitoring-review.component.html',
  styles: []
})
export class LeadMonitoringReviewComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor(private httpClient: HttpClient, private toastr: NGXToastrService, private router: Router) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchReviewUploadLead.json";
    this.inputPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReviewUploadLead.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "UMH.OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
  }

  cancel(ev) {
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
