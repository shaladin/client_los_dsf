import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { LeadVerfObj } from 'app/shared/model/Request/LEAD/LeadVerfObj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { Router } from '@angular/router';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { environment } from 'environments/environment';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-lead-verif',
  templateUrl: './lead-verif.component.html'
})

export class LeadVerifComponent implements OnInit {
  arrLeadVerf: Array<LeadVerfObj> = new Array();
  listSelectedId: Array<any> = new Array<any>();
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private cookieService: CookieService) { }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    if (environment.isCore) {
      this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/V2/LeadVerifTempPagingV2.json";
      this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/V2/LeadVerifTempPagingV2.json";
      this.tempPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_LEAD,
      this.RequestTaskModel.OfficeCode = UserAccess[CommonConstant.OFFICE_CODE],
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_LEAD_VERIFICATION,
      this.RequestTaskModel.RoleCode = UserAccess[CommonConstant.ROLE_CODE]
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "LeadNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";

      this.tempPagingObj.integrationObj = this.IntegrationObj;

      let AddCrit = new CriteriaObj();
      AddCrit.DataType = "text";
      AddCrit.propName = "L.LEAD_STEP";
      AddCrit.restriction = AdInsConstant.RestrictionEq;
      AddCrit.value = CommonConstant.LeadStepLeadVerf;
      this.tempPagingObj.addCritInput.push(AddCrit);
    } else {
      this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/LeadVerifTempPaging.json";
      this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/LeadVerifTempPaging.json";
    }
    this.tempPagingObj.isReady = true;
  }

  getListTemp(ev) {
    this.listSelectedId = ev.TempListObj;
  }

  SaveLeadVerf(verifyStatus: string) {
    if (this.listSelectedId.length == 0) {
      this.toastr.warningMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    }

    if(environment.isCore){
      for (let index = 0; index < this.listSelectedId.length; index++) {
        let tempLeadVerfObj = new LeadVerfObj();
        tempLeadVerfObj.VerifyStat = verifyStatus;
        tempLeadVerfObj.LeadId = this.listSelectedId[index].LeadId;
        tempLeadVerfObj.WfTaskListId = this.listSelectedId[index].Id
        this.arrLeadVerf.push(tempLeadVerfObj);
      }

      this.http.post(URLConstant.AddRangeLeadVerfV2, { LeadVerfObjs: this.arrLeadVerf }).subscribe(
        response => {
          this.toastr.successMessage(response['message']);
        }
      );
    }else{
      for (let index = 0; index < this.listSelectedId.length; index++) {
        let tempLeadVerfObj = new LeadVerfObj();
        tempLeadVerfObj.VerifyStat = verifyStatus;
        tempLeadVerfObj.LeadId = this.listSelectedId[index].LeadId;
        tempLeadVerfObj.WfTaskListId = this.listSelectedId[index].WfTaskListId
        this.arrLeadVerf.push(tempLeadVerfObj);
      }

      this.http.post(URLConstant.AddRangeLeadVerf, { LeadVerfObjs: this.arrLeadVerf }).subscribe(
        response => {
          this.toastr.successMessage(response['message']);
        }
      );
    }
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_VERIF], {});
    });
  }
}
