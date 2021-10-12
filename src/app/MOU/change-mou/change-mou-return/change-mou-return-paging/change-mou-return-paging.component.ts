import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { UcpagingComponent } from '@adins/ucpaging';
import { HttpClient } from '@angular/common/http';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CookieService } from 'ngx-cookie';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';

@Component({
  selector: 'app-change-mou-return-paging',
  templateUrl: './change-mou-return-paging.component.html'
})
export class ChangeMouReturnPagingComponent implements OnInit {
  @ViewChild(UcpagingComponent) ucpaging;
  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj>;
  UserAccess: CurrentUserContext;
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();

  constructor(
    private http: HttpClient, 
    private toastr: NGXToastrService, 
    private router: Router, 
    private cookieService: CookieService) { }

  ngOnInit() {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/mou/searchChangeMouReturn.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchChangeMouReturn.json";
    
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MOU.MR_MOU_TYPE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      }
    ];

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/mou/V2/searchChangeMouReturnV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/V2/searchChangeMouReturnV2.json";
      this.inputPagingObj.isJoinExAPI = true;
      
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CHANGE_MOU;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_CHG_MOU_RTRN;
      this.RequestTaskModel.OfficeRoleCodes = [this.UserAccess[CommonConstant.ROLE_CODE],
                                               this.UserAccess[CommonConstant.OFFICE_CODE],
                                               this.UserAccess[CommonConstant.ROLE_CODE] + "-" + this.UserAccess[CommonConstant.OFFICE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "TrxNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }

    this.arrCrit = new Array<CriteriaObj>();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'CMT.STATUS';
    critObj.value = 'RTN';
    this.arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  getEvent(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }
}