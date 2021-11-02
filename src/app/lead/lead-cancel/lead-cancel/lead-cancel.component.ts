import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { HttpClient } from '@angular/common/http';

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
  HeadOfficeCode : string;
  MrLeadTypeCode: string;

  constructor(private http: HttpClient, private toastr: NGXToastrService, private route: ActivatedRoute, private router: Router, private cookieService: CookieService) 
  { 
    this.route.queryParams.subscribe(params => {
      if (params["MrLeadTypeCode"] != null) {
        this.MrLeadTypeCode = params["MrLeadTypeCode"];
      }
    });
  }
 
  async ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/LeadCancelTempPaging.json";
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/LeadCancelTempPaging.json";
    this.tempPagingObj.title = CommonConstant.LeadCancelTitle;

    if(this.MrLeadTypeCode == CommonConstant.MrLeadTypeCodeSimpleLead) {
      this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/SimpleLeadCancelTempPaging.json";
      this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/SimpleLeadCancelTempPaging.json";
      this.tempPagingObj.title = CommonConstant.SimpleLeadCancelTitle;;
    }

    if(environment.isCore) {

      await this.http.post(URLConstant.GetHeadOffice,{}).toPromise().then(
        (response) => {
          this.HeadOfficeCode = response["OfficeCode"];
        });

      this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/V2/LeadCancelTempPagingV2.json";
      this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/V2/LeadCancelTempPagingV2.json";
      
      if(this.MrLeadTypeCode == CommonConstant.MrLeadTypeCodeSimpleLead) {
        this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/V2/SimpleLeadCancelTempPagingV2.json";
        this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/V2/SimpleLeadCancelTempPagingV2.json";
      }
      
      this.tempPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKey = this.MrLeadTypeCode == CommonConstant.MrLeadTypeCodeLead ? CommonConstant.WF_CODE_LEAD : CommonConstant.WF_CODE_SIMPLE_LEAD;
      if(UserAccess[CommonConstant.OFFICE_CODE] != this.HeadOfficeCode)
        this.RequestTaskModel.OfficeCode = UserAccess[CommonConstant.OFFICE_CODE];

      this.IntegrationObj.baseUrl = URLConstant.GetAllWorkflowInstance;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "LeadNo";
      this.IntegrationObj.rightColumnToJoin = "BusinessKey";
      this.IntegrationObj.joinType = AdInsConstant.JoinTypeLeft;
      this.tempPagingObj.integrationObj = this.IntegrationObj;
    }

    let addCrit: CriteriaObj = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "L.LEAD_STAT";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = this.allowedStat;
    this.tempPagingObj.addCritInput.push(addCrit);

    let addCrit2 = new CriteriaObj();
    addCrit2.DataType = "text";
    addCrit2.propName = "L.MR_LEAD_TYPE_CODE";
    addCrit2.restriction = AdInsConstant.RestrictionEq;
    addCrit2.value = this.MrLeadTypeCode;
    this.tempPagingObj.addCritInput.push(addCrit2);

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
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_CONFIRM_CANCEL], { "LeadIds": params, "WfTaskListIds": taskListId, "MrLeadTypeCode" : this.MrLeadTypeCode });
  }
}
