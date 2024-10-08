import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { UcpagingComponent } from '@adins/ucpaging';
import { HttpClient } from '@angular/common/http';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { Router } from '@angular/router';
import { LeadForRejectObj } from 'app/shared/model/request/lead/lead-for-reject-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { environment } from 'environments/environment';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { CookieService } from 'ngx-cookie';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-lead-update',
  templateUrl: './lead-update.component.html',
  providers: [NGXToastrService]
})
export class LeadUpdateComponent implements OnInit {
  @ViewChild(UcpagingComponent) ucpaging;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private cookieService: CookieService) { }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/searchLeadUpdate.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLeadUpdate.json";
    
    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchLeadUpdateV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchLeadUpdateV2.json";
      this.inputPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_LEAD;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_LEAD_UPD;
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
      let leadReject = new LeadForRejectObj;
      leadReject.LeadStat = CommonConstant.LeadStatReject;
      leadReject.LeadStep = CommonConstant.LeadStatReject;
      leadReject.LeadId = event.RowObj.LeadId;
      leadReject.WfTaskListId = environment.isCore ? event.RowObj.Id : event.RowObj.WfTaskListId;

      let RejectLeadUrl = environment.isCore ? URLConstant.RejectLeadV2 : URLConstant.RejectLead;
      this.http.post(RejectLeadUrl, leadReject).subscribe(
        response => {
          this.toastr.successMessage(response["Message"]);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_UPDATE_PAGING], {});
          });
        }
      );
    }
  }
}