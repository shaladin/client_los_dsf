import { Component, OnDestroy, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { environment } from 'environments/environment';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-return-handling-collateral-paging',
  templateUrl: './return-handling-collateral-paging.component.html',
})
export class ReturnHandlingCollateralPagingComponent implements OnInit, OnDestroy {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  isReady: boolean = false;
  navigationSubscription;

  constructor(private route: ActivatedRoute, private cookieService: CookieService, private router: Router) {
    this.SubscribeParam();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.RefetchData();
      }
    });
  }

  SubscribeParam(){
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.SetUcPaging();
  }

  RefetchData(){
    this.isReady = false;
    this.SubscribeParam();
    this.SetUcPaging();
    setTimeout (() => {
      this.isReady = true
    }, 10);
  }

  SetUcPaging() {
    this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingCollateral.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingCollateral.json";
    this.inputPagingObj.addCritInput = new Array();
    if (environment.isCore) {
      let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchReturnHandlingCollateralV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchReturnHandlingCollateralV2.json";
      this.inputPagingObj.isJoinExAPI = true

      let RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
      RequestTaskModel.ProcessKey = CommonConstant.RTN_ADD_COLTR + this.BizTemplateCode;
      let officeCode: string = context[CommonConstant.OFFICE_CODE];
      let roleCode: string = context[CommonConstant.ROLE_CODE];
      RequestTaskModel.TaskDefinitionKey = CommonConstant.ADD_COLTR + this.BizTemplateCode;
      RequestTaskModel.OfficeRoleCodes = [officeCode, roleCode + "-" + officeCode, roleCode];

      let integrationObj: IntegrationObj = new IntegrationObj();
      integrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      integrationObj.requestObj = RequestTaskModel;
      integrationObj.leftColumnToJoin = "AppNo";
      integrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = integrationObj;
      return;
    }
    this.inputPagingObj.addCritInput = this.ActAndOfficeCriteria();
  }

  ActAndOfficeCriteria(): Array<CriteriaObj> {
    var critObjs: Array<CriteriaObj> = new Array<CriteriaObj>();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "ADD_COLTR_" + this.BizTemplateCode;
    critObjs.push(critObj);

    return critObjs;
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
  }
}
