import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { UcpagingComponent } from '@adins/ucpaging';
import { HttpClient } from '@angular/common/http';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router } from '@angular/router';
import { LeadForRejectObj } from 'app/shared/model/LeadForRejectObj.model';

@Component({
  selector: 'app-lead-update',
  templateUrl: './lead-update.component.html',
  providers: [NGXToastrService]
})
export class LeadUpdateComponent implements OnInit {
  @ViewChild(UcpagingComponent) ucpaging;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  
  constructor(
    private http: HttpClient, 
    private toastr: NGXToastrService, 
    private router: Router) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchLeadUpdate.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputPagingObj.deleteUrl = "";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLeadUpdate.json";
  }

  rejectLead(event)
  {
    // console.log("testevent")
    // console.log(event)

    if (confirm("Are you sure to reject this Lead?"))
    {
      var leadReject = new LeadForRejectObj;
      leadReject.LeadStat = "RJC";
      leadReject.LeadStep = "RJC";
      leadReject.LeadId = event.RowObj.LeadId;
      leadReject.WfTaskListId = event.RowObj.WfTaskListId;

      // console.log("test")
      // console.log(leadReject)
      
      this.http.post(AdInsConstant.RejectLead, leadReject).subscribe(
          response => {
            this.toastr.successMessage(response["Message"]);
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/Lead/LeadUpdate/Paging']);
          });
          }
        );
    }
  }
}