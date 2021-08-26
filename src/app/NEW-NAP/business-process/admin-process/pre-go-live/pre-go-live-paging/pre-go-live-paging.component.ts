import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { CookieService } from 'ngx-cookie';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-pre-go-live-paging',
  templateUrl: './pre-go-live-paging.component.html'
})
export class PreGoLivePagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  bizTemplateCode: string;
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();

  constructor(private route: ActivatedRoute, private router: Router, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.bizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.bizTemplateCode);
      }
      else {
        this.bizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
      }
    });
  }



  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/searchPreGoLive.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchPreGoLive.json";
    var critInput = new CriteriaObj();
    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchPreGoLiveV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchPreGoLiveV2.json";
      this.inputPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKeys = [CommonConstant.WF_CRP_CF4W_AFT_ACT, CommonConstant.WF_CRP_FCTR_AFTER_ACT, CommonConstant.WF_CRP_FL4W_AFT_ACT];
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_PGLV + this.bizTemplateCode;
      this.RequestTaskModel.OfficeRoleCodes = [ UserAccess[CommonConstant.ROLE_CODE],
                                                UserAccess[CommonConstant.OFFICE_CODE],
                                                UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE] ];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AgrmntNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
    else{
      critInput.propName = "wFht.ACT_CODE";
      critInput.restriction = AdInsConstant.RestrictionEq;
      critInput.value = "PGLV_" + this.bizTemplateCode;
      this.inputPagingObj.addCritInput.push(critInput);
    }
  }

  GetCallBack(ev: any) {
    let wfTaskListIdTemp = environment.isCore? ev.RowObj.Id : ev.RowObj.TaskListId;
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
    else if (ev.Key == "Edit") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PGL_DETAIL], { "AgrmntId": ev.RowObj.AgrmntId, "AppId": ev.RowObj.AppId, "TaskListId": wfTaskListIdTemp, "AgrmntNo": ev.RowObj.AgrmntNo, "BizTemplateCode": this.bizTemplateCode });
    }
  }
}
