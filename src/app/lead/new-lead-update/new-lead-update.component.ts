import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { LeadForRejectObj } from 'app/shared/model/lead-for-reject-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-new-lead-update',
  templateUrl: './new-lead-update.component.html',
  styles: []
})
export class NewLeadUpdateComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchSimpleLeadUpdate.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchSimpleLeadUpdate.json";

    if (environment.isCore) {
      let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

      this.inputPagingObj._url = "./assets/ucpaging/V2/searchSimpleLeadUpdateV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchSimpleLeadUpdateV2.json";
      this.inputPagingObj.isJoinExAPI = true;

      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_SIMPLE_LEAD;      
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_SIMPLE_LEAD_UPD;     
      this.RequestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE],
                                               UserAccess[CommonConstant.OFFICE_CODE],
                                               UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE]];

      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "LeadNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;

      let AddCrit = new CriteriaObj();
      AddCrit.DataType = "text";
      AddCrit.propName = "L.LEAD_STEP";
      AddCrit.restriction = AdInsConstant.RestrictionEq;
      AddCrit.value = CommonConstant.LeadStepLeadUpd;
      this.inputPagingObj.addCritInput.push(AddCrit);
    }
  }

  rejectLead(event) {
    if (confirm("Are you sure to reject this Lead?")) {
      let urlPost = environment.isCore ? URLConstant.RejectLeadV2 : URLConstant.RejectLead;
      let leadReject = new LeadForRejectObj;

      leadReject.LeadId = event.RowObj.LeadId;
      leadReject.LeadStat = CommonConstant.LeadStatReject;
      leadReject.LeadStep = CommonConstant.LeadStatReject;
      leadReject.WfTaskListId = environment.isCore ? event.RowObj.ProcessInstanceId : event.RowObj.WfTaskListId; //ProcessInstanceId = WF Instance GUID Versi Camunda

      this.http.post(urlPost, leadReject).subscribe(
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
