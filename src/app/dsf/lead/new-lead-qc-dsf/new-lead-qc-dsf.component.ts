import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ClaimTaskLeadDsf } from 'app/shared/model/claim-task-lead-dsf-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { LeadForRejectObj } from 'app/shared/model/lead-for-reject-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-new-lead-qc-dsf',
  templateUrl: './new-lead-qc-dsf.component.html',
  styleUrls: ['./new-lead-qc-dsf.component.css']
})
export class NewLeadQcDsfComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  IsReady: boolean = false;
  CurrentUserContext: any;
  ClaimTaskLeadDsf: ClaimTaskLeadDsf = new ClaimTaskLeadDsf();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private cookieService: CookieService,
    private elRef: ElementRef, 
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.inputPagingObj._url = "./assets/dsf/ucpaging/searchSimpleLeadUpdateDsf.json";
    this.inputPagingObj.pagingJson = "./assets/dsf/ucpaging/searchSimpleLeadUpdateDsf.json";

    if (environment.isCore) {
      let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

      this.inputPagingObj._url = "./assets/dsf/ucpaging/searchSimpleLeadQCV2Dsf.json";
      this.inputPagingObj.pagingJson = "./assets/dsf/ucpaging/searchSimpleLeadQCV2Dsf.json";
      this.inputPagingObj.isJoinExAPI = true;

      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_SIMPLE_LEAD;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_SIMPLE_LEAD_QC;
      this.RequestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE],
                                               UserAccess[CommonConstant.OFFICE_CODE],
                                               UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE]];

      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "LeadNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;

      this.IsReady = true;
    }
  }

  // Self Custom Changes
  ngAfterViewInit(){
    if (this.IsReady)
    {
      this.SelfCustomDisableOffice(500);
    }
    this.renderer.listen(this.elRef.nativeElement.querySelector('button[class="btn btn-raised btn-warning mr-1"]'), 'click', (event) => {      
      this.SelfCustomDisableOffice(50);
    });
    }
  // Self Custom Changes
  SelfCustomDisableOffice(timeout) {
    if (this.CurrentUserContext.RoleCode == "DPC - SPV" && this.CurrentUserContext.OfficeCode == "1000")
      {
        setTimeout(() => {
          const element1 = this.elRef.nativeElement.querySelector('select[name="L.ORI_OFFICE_CODE"]');
          if (element1 && element1.display != 'none') {
            this.renderer.setStyle(element1, "display", "none");
            element1.insertAdjacentHTML('afterend', '<label>ALL</label>');
          }
        }, timeout);
      }
  }

}
