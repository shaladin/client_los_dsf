import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { LeadCancelObj } from 'app/shared/model/LeadCancelObj.Model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { String } from 'typescript-string-operations';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { environment } from 'environments/environment';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-lead-cancel',
  templateUrl: './lead-cancel.component.html'
})

export class LeadCancelComponent implements OnInit {
  listSelectedId: Array<any> = new Array<any>();
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  allowedStat = ['INP', 'NEW', 'NEW_SMPL'];
  tempLeadCancelObj: LeadCancelObj;
  

  constructor(private toastr: NGXToastrService, private router: Router, private cookieService: CookieService) { }
 
  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/LeadCancelTempPaging.json";
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/LeadCancelTempPaging.json";

    if(environment.isCore) {
      this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/V2/LeadCancelTempPagingV2.json";
      this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/V2/LeadCancelTempPagingV2.json";
      this.tempPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKeys = [CommonConstant.WF_CODE_LEAD,CommonConstant.WF_CODE_SIMPLE_LEAD];
      this.RequestTaskModel.RoleCode = UserAccess[CommonConstant.ROLE_CODE];
      this.RequestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE],
                                               UserAccess[CommonConstant.OFFICE_CODE],
                                               UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE],
                                              ];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllWorkflowInstance;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "LeadNo";
      this.IntegrationObj.rightColumnToJoin = "BusinessKey";
      this.tempPagingObj.integrationObj = this.IntegrationObj;
    }

    let addCrit: CriteriaObj = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "L.LEAD_STAT";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = this.allowedStat;
    this.tempPagingObj.addCritInput.push(addCrit);

    this.tempPagingObj.isReady = true;
  }

  getListTemp(ev) {
    this.listSelectedId = ev.TempListObj;
  }

  SaveLeadCancel() {
    if (this.listSelectedId.length == 0) {
      this.toastr.warningMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    } else if (this.listSelectedId.length > 50) {
      this.toastr.warningMessage(String.Format(ExceptionConstant.MAX_DATA, 50));
      return;
    }

    this.tempLeadCancelObj = new LeadCancelObj();
    for (let index = 0; index < this.listSelectedId.length; index++) {
      this.tempLeadCancelObj.LeadIds.push(this.listSelectedId[index].LeadId);

      if(environment.isCore) {
        if (this.listSelectedId[index].Id != undefined && this.listSelectedId[index].Id != null)
          this.tempLeadCancelObj.listWfTaskListId.push(this.listSelectedId[index].Id);
          
        continue;
      }

      if (this.listSelectedId[index].WfTaskListId != undefined && this.listSelectedId[index].WfTaskListId != null)
        this.tempLeadCancelObj.listWfTaskListId.push(this.listSelectedId[index].WfTaskListId);
    }

    let params: string = this.tempLeadCancelObj.LeadIds.join(',')
    let taskListId: string = this.tempLeadCancelObj.listWfTaskListId.join(',')
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_CONFIRM_CANCEL], { "LeadIds": params, "WfTaskListIds": taskListId });
  }
}
