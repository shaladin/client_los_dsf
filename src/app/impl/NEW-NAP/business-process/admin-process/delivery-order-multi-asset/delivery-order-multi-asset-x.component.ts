import { Component, OnInit, OnDestroy } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';
import { String } from 'typescript-string-operations';

@Component({
  selector: 'app-delivery-order-multi-asset-x',
  templateUrl: './delivery-order-multi-asset-x.component.html',
  styles: []
})
export class DeliveryOrderMultiAssetXComponent implements OnInit, OnDestroy {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  bizTemplateCode: string;
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  navigationSubscription;
  isReady:boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router) {
    this.SubscribeParam();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.RefetchData();
      }
    });
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

  SetUcPaging(){
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/impl/ucpaging/searchDeliveryOrderMultiAsset.json";
    this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/searchDeliveryOrderMultiAsset.json";

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/impl/ucpaging/V2/searchDeliveryOrderMultiAssetV2.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/V2/searchDeliveryOrderMultiAssetV2.json";
      this.inputPagingObj.isJoinExAPI = true

      this.RequestTaskModel.ProcessKey = String.Format(CommonConstant.WF_CRP_AFT_ACT, this.bizTemplateCode);
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_DO + this.bizTemplateCode;
      this.RequestTaskModel.OfficeRoleCodes = [ UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE] ,
                                                UserAccess[CommonConstant.ROLE_CODE],
                                                UserAccess[CommonConstant.OFFICE_CODE]];

      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AgrmntNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
    else{
      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionEq;
      critObj.propName = 'DOD.ACT_CODE';
      critObj.value = "DO_" + this.bizTemplateCode;

      this.inputPagingObj.addCritInput.push(critObj);
    }

    var critBizTemplate = new CriteriaObj();
    critBizTemplate.restriction = AdInsConstant.RestrictionEq;
    critBizTemplate.propName = 'DOD.BIZ_TEMPLATE_CODE';
    critBizTemplate.value = this.bizTemplateCode;

    this.inputPagingObj.addCritInput.push(critBizTemplate);
  }

  SubscribeParam(){
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.bizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode",this.bizTemplateCode);
      }
      else{
        this.bizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
      }
    });
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

}
