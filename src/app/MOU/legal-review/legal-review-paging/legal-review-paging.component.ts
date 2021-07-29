import { Component, OnInit } from "@angular/core";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { CriteriaObj } from "app/shared/model/CriteriaObj.model";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { CookieService } from "ngx-cookie";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { GenericObj } from "app/shared/model/Generic/GenericObj.Model";
import { CurrentUserContext } from "app/shared/model/CurrentUserContext.model";
import { environment } from "environments/environment";
import { RequestTaskModelObj } from "app/shared/model/Workflow/V2/RequestTaskModelObj.model";
import { IntegrationObj } from "app/shared/model/library/IntegrationObj.model";

@Component({
  selector: "app-legal-review-paging",
  templateUrl: "./legal-review-paging.component.html",
})
export class LegalReviewPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  arrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  requestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/searchLegalReview.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLegalReview.json";

    const addCritMouStat = new CriteriaObj();
    addCritMouStat.DataType = "text";
    addCritMouStat.propName = "MC.MOU_STAT";
    addCritMouStat.restriction = AdInsConstant.RestrictionEq;
    addCritMouStat.value = "LRV";
    this.arrCrit.push(addCritMouStat);

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchLegalReviewV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchLegalReviewV2.json";

      this.inputPagingObj.isJoinExAPI = true;

      this.requestTaskModel.ProcessKey = CommonConstant.WF_MOU_GENERAL,
      this.requestTaskModel.OfficeCode = UserAccess[CommonConstant.OFFICE_CODE],
      this.requestTaskModel.TaskDefinitionKey = CommonConstant.LEGAL_RVW,
      this.requestTaskModel.RoleCode = UserAccess[CommonConstant.ROLE_CODE],
      this.requestTaskModel.OfficeRoleCodes = [CommonConstant.HeadOffice, CommonConstant.SuperUser],
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.requestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "MouCustNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.IntegrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
    this.inputPagingObj.addCritInput = this.arrCrit;
    
  }

  getEvent(event) {
    let custId: number;
    let mrCustTypeCode: string;
    if (event.Key == "customer") {
      this.CustNoObj.CustNo = event.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
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
