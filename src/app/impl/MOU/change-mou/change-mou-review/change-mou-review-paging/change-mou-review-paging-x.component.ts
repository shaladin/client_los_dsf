import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CookieService } from 'ngx-cookie';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';

@Component({
  selector: 'app-change-mou-review-paging-x',
  templateUrl: './change-mou-review-paging-x.component.html',
  styleUrls: []
})
export class ChangeMouReviewPagingXComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  UserAccess: CurrentUserContext;
  link: string;
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/impl/ucpaging/mou/searchChangeMouReviewX.json";
    this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/searchChangeMouReviewX.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MR_MOU_TYPE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      }
    ];

    if(environment.isCore) {
      this.inputPagingObj._url = "./assets/ucpaging/mou/V2/searchChangeMouReviewV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/V2/searchChangeMouReviewV2.json";
      this.inputPagingObj.isJoinExAPI = true;
      
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CHANGE_MOU;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_CHNG_MOU_REVIEW;
      this.RequestTaskModel.OfficeCode = UserAccess[CommonConstant.OFFICE_CODE];
      this.RequestTaskModel.RoleCode = UserAccess[CommonConstant.ROLE_CODE];
      this.RequestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "TrxNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
  }

  GetCallBack(event) {
    let custId: number;
    let mrCustTypeCode: string;
    if (event.Key == "customer") {
     let CustNoObj = { CustNo : event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, CustNoObj).subscribe(
        (response) => {
          custId = response['CustId'];
          mrCustTypeCode = response['MrCustTypeCode'];

          if(mrCustTypeCode == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(custId);
          }
          
          if(mrCustTypeCode == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(custId);
          }
        });
    }
  }
}
