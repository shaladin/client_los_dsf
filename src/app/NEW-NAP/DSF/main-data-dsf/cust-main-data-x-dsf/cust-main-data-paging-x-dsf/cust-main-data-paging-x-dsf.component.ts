import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { ExceptionConstantDsf } from 'app/shared/constant/ExceptionConstantDsf';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { SpvDPCDsfObj } from 'app/dsf/model/SpvDPCDsfObj.Model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';

@Component({
  selector: 'app-cust-main-data-paging-x-dsf',
  templateUrl: './cust-main-data-paging-x-dsf.component.html',
  styleUrls: ['./cust-main-data-paging-x-dsf.component.css']
})
export class CustMainDataPagingXDsfComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<CriteriaObj>;
  bizTemplateCode: string;
  userAccess: CurrentUserContext;
  token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  SpvDPCDsfObj: SpvDPCDsfObj = new SpvDPCDsfObj();
  ReqSpvDPCDsfObj: SpvDPCDsfObj = new SpvDPCDsfObj();
  isSpvDPC: boolean = false;
  isDPC: boolean = false;
  
  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) this.bizTemplateCode = params["BizTemplateCode"];
    });
  }

  makeCriteria() {
    if(environment.isCore){
      var critObj2 = new CriteriaObj();
      critObj2.restriction = AdInsConstant.RestrictionIn;
      critObj2.propName = 'a.APP_CURR_STEP';
      critObj2.listValue = [CommonConstant.AppStepCust, CommonConstant.AppStepFamily, CommonConstant.AppStepGuar, CommonConstant.AppStepShr];
      this.arrCrit.push(critObj2);
    }else{
      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'WTL.ACT_CODE';
      critObj.value = "CUST_MD_" + this.bizTemplateCode;
      this.arrCrit.push(critObj);
    }
      
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'a.BIZ_TEMPLATE_CODE';
    critObj.value = this.bizTemplateCode;
    this.arrCrit.push(critObj);
  }

  async ngOnInit() {
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    
      this.arrCrit = new Array();
      this.makeCriteria();

      this.inputPagingObj.title = "Applicant Data Paging";
      this.inputPagingObj._url = "./assets/ucpaging/searchAppCustMainData.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppCustMainData.json";
      this.inputPagingObj.addCritInput = this.arrCrit;

      if(environment.isCore){
        this.inputPagingObj._url = "./assets/ucpaging/V2/searchAppCustMainDataV2.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchAppCustMainDataV2.json";
        this.inputPagingObj.isJoinExAPI = true
        
        this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.bizTemplateCode;
        this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_CUST_MD + this.bizTemplateCode;
        this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE],
                                                this.userAccess[CommonConstant.OFFICE_CODE],
                                                this.userAccess[CommonConstant.ROLE_CODE] + "-" + this.userAccess[CommonConstant.OFFICE_CODE]];
        
        this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
        this.IntegrationObj.requestObj = this.RequestTaskModel;
        this.IntegrationObj.leftColumnToJoin = "AppNo";
        this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
        this.inputPagingObj.integrationObj = this.IntegrationObj;
      }

      if (this.userAccess[CommonConstant.ROLE_CODE] == 'DPC')
      {
        this.isDPC = true;
        this.ReqSpvDPCDsfObj.userName = this.userAccess.UserName;
        this.http.post(URLConstantDsf.GetSpvDPCDSF, this.ReqSpvDPCDsfObj).subscribe(
          (response) => {
            this.SpvDPCDsfObj.userName = response["userName"];
            if (this.SpvDPCDsfObj.userName != null && this.SpvDPCDsfObj.userName != '')
            {
              this.isSpvDPC = true;
            }
          }
        )
      }
  }

  AddApp(addType = '') {
    if (!this.bizTemplateCode) return;
    this.http.post(URLConstant.GetRefOfficeByOfficeCode, {Code : this.userAccess.OfficeCode}).subscribe(
      (response) => {
        if (response["IsAllowAppCreated"] == true) {

          if (this.isDPC)
          {
            if (this.isSpvDPC)
            {
              if(this.bizTemplateCode == CommonConstant.CFNA || this.bizTemplateCode == CommonConstant.FL4W)
              {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_MAIN_DATA_NAP1_ADD_X], { "BizTemplateCode": this.bizTemplateCode, "addType": addType });
              }
              else
              {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_MAIN_DATA_NAP1_ADD_X], { "BizTemplateCode": this.bizTemplateCode });
              }
            }
            else
            {
              this.toastr.warningMessage(ExceptionConstantDsf.SPV_DPC_NOT_AVAILABLE);
            }
          }
          else
          {
            if(this.bizTemplateCode == CommonConstant.CFNA || this.bizTemplateCode == CommonConstant.FL4W)
            {
              AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_MAIN_DATA_NAP1_ADD_X], { "BizTemplateCode": this.bizTemplateCode, "addType": addType });
            }
            else
            {
              AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_MAIN_DATA_NAP1_ADD_X], { "BizTemplateCode": this.bizTemplateCode });
            }
          }

        } else {
          this.toastr.typeErrorCustom('Office Is Not Allowed to Create App');
        }
      });
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
    if (ev.Key == "Edit") {
      switch (this.bizTemplateCode) {
        case CommonConstant.CF4W:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_CF4W_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId });
          break;
        case CommonConstant.CFRFN4W:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CFRFN4W_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId });
          break;
        case CommonConstant.FCTR:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_FCTR_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId });
          break;
        case CommonConstant.FL4W:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_FL4W_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId });
          break;
        case CommonConstant.CFNA:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_CFNA_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId });
          break;
        case CommonConstant.OPL:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ROS_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId, "IsMainData": true });
          break;
        case CommonConstant.DF :
          AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_DLFN_NAP1], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId});
        break;
      }
    }
  }

}
