import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'nap-detail-paging',
  templateUrl: './nap-detail-paging.component.html'
})
export class NapDetailPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<CriteriaObj>;
  bizTemplateCode: string;
  userAccess: CurrentUserContext;
  token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  
  constructor(
    private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) this.bizTemplateCode = params["BizTemplateCode"];
    });
  }

  initListValueCurrStep(){
    let tempList: Array<string> = new Array();
    tempList = [CommonConstant.AppStepNapd, CommonConstant.AppStepRef, CommonConstant.AppStepApp, CommonConstant.AppStepAsset, CommonConstant.AppStepIns, CommonConstant.AppStepLIns, CommonConstant.AppStepFin, CommonConstant.AppStepTC, CommonConstant.AppStepUplDoc];
    return tempList;
  }

  makeCriteria() {
    if(environment.isCore){
      var critObj2 = new CriteriaObj();
      critObj2.restriction = AdInsConstant.RestrictionIn;
      critObj2.propName = 'a.APP_CURR_STEP';
      critObj2.listValue = this.initListValueCurrStep();
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

    this.inputPagingObj.title = "NAP 2 Paging";
    this.inputPagingObj._url = "./assets/ucpaging/searchAppCustMainData.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppCustMainData.json";
    this.inputPagingObj.addCritInput = this.arrCrit;

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchAppCustMainDataV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchAppCustMainDataV2.json";
      this.inputPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.bizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_NAPD_MD + this.bizTemplateCode;
      this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AppNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
    if (ev.Key == "Edit") {
      let WfTaskListId = environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId;
      switch (this.bizTemplateCode) {
        case CommonConstant.CF4W:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CF4W_NAP2], { "AppId": ev.RowObj.AppId, "WfTaskListId": WfTaskListId, "IsMainData": true });
          break;
        case CommonConstant.CFRFN4W:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CFRFN4W_NAP2], { "AppId": ev.RowObj.AppId, "WfTaskListId": WfTaskListId, "IsMainData": true });
          break;
        case CommonConstant.FCTR:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_FCTR_NAP2], { "AppId": ev.RowObj.AppId, "WfTaskListId": WfTaskListId, "IsMainData": true });
          break;
        case CommonConstant.FL4W:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_FL4W_NAP2], { "AppId": ev.RowObj.AppId, "WfTaskListId": WfTaskListId, "IsMainData": true });
          break;
        case CommonConstant.CFNA:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CFNA_NAP2], { "AppId": ev.RowObj.AppId, "WfTaskListId": WfTaskListId, "IsMainData": true });
          break;
        case CommonConstant.OPL:
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ROS_NAP2], { "AppId": ev.RowObj.AppId, "WfTaskListId": WfTaskListId, "IsMainData": true });
          break;
        case CommonConstant.DF :
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_DLFN_NAP2], { "AppId": ev.RowObj.AppId, "WfTaskListId": WfTaskListId, "IsMainData": true});
        break;
      }
    }
  }
}
