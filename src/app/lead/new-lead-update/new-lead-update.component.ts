import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { LeadForRejectObj } from 'app/shared/model/LeadForRejectObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-new-lead-update',
  templateUrl: './new-lead-update.component.html',
  styles: []
})
export class NewLeadUpdateComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchSimpleLeadUpdate.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchSimpleLeadUpdate.json";
  }

  rejectLead(event) {
    if (confirm("Are you sure to reject this Lead?")) {
      let leadReject = new LeadForRejectObj;
      leadReject.LeadId = event.RowObj.LeadId;
      leadReject.LeadStat = CommonConstant.LeadStatReject;
      leadReject.LeadStep = CommonConstant.LeadStatReject;
      leadReject.WfTaskListId = event.RowObj.WfTaskListId;

      this.http.post(URLConstant.RejectLead, leadReject).subscribe(
        response => {
          this.toastr.successMessage(response["Message"]);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/Lead/SimpleLeadUpdate/Paging']);
          });
        }
      );
    }
  }

}
