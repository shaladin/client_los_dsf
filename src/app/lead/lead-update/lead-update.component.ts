import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { UcpagingComponent } from '@adins/ucpaging';
import { HttpClient } from '@angular/common/http';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router } from '@angular/router';
import { LeadForRejectObj } from 'app/shared/model/Request/LEAD/LeadForRejectObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

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
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "L.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "L.MR_LEAD_SOURCE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
  }

  rejectLead(event)
  {
    if (confirm("Are you sure to reject this Lead?"))
    {
      var leadReject = new LeadForRejectObj;
      leadReject.LeadStat = CommonConstant.LeadStatReject;
      leadReject.LeadStep = CommonConstant.LeadStatReject;
      leadReject.LeadId = event.RowObj.LeadId;
      leadReject.WfTaskListId = event.RowObj.WfTaskListId;
      
      this.http.post(URLConstant.RejectLead, leadReject).subscribe(
          response => {
            this.toastr.successMessage(response["Message"]);
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              AdInsHelper.RedirectUrl(this.router,[NavigationConstant.LEAD_UPDATE_PAGING],{});
          });
          }
        );
    }
  }
}