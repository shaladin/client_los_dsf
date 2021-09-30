import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { ActivatedRoute } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-return-handling-additional-tc-paging',
  templateUrl: './return-handling-additional-tc-paging.component.html',
  styleUrls: []
})
export class ReturnHandlingAdditionalTcPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();

  constructor(private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    
    this.inputPagingObj._url = "./assets/ucpaging/searchReturnHandlingAdditionalTc.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingAdditionalTc.json";
    
    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchReturnHandlingAdditionalTcV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchReturnHandlingAdditionalTcV2.json";
      this.inputPagingObj.isJoinExAPI = true
      
      this.RequestTaskModel.ProcessKey = CommonConstant.RTN_ADD_TC + this.BizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ADD_TC + this.BizTemplateCode;
      this.RequestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE],
                                                UserAccess[CommonConstant.OFFICE_CODE],
                                                UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AppNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
    else{
      this.inputPagingObj.addCritInput = this.ActAndOfficeCriteria();
    }
    
  }

  ActAndOfficeCriteria(): Array<CriteriaObj> {
    var critObjs: Array<CriteriaObj> = new Array<CriteriaObj>();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "ADD_TC_" + this.BizTemplateCode;
    critObjs.push(critObj);

    return critObjs;
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }
}
