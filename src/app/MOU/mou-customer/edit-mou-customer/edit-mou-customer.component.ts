import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { UcpagingComponent } from '@adins/ucpaging';
import { HttpClient } from '@angular/common/http';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { environment } from 'environments/environment';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-edit-mou-customer',
  templateUrl: './edit-mou-customer.component.html',
  providers: [NGXToastrService]
})
export class EditMouCustomerComponent implements OnInit {
  @ViewChild(UcpagingComponent) ucpaging;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  arrCrit: Array<CriteriaObj>;
  requestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService, private AdInsHelperService: AdInsHelperService) { }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/searchEditMouCustomer.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchEditMouCustomer.json";
    this.arrCrit = new Array<CriteriaObj>();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'MOU.MOU_STAT';
    critObj.value = 'RTN';
    this.arrCrit.push(critObj);
    
    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchEditMouCustomerV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchEditMouCustomerV2.json";

      this.inputPagingObj.isJoinExAPI = true;

      this.requestTaskModel.ProcessKeys = [CommonConstant.WF_MOU_GENERAL, CommonConstant.WF_MOU_FACTORING, CommonConstant.WF_MOU_DLFN];
      this.requestTaskModel.TaskDefinitionKeys = [CommonConstant.MOU_RETURN + CommonConstant.MOU_TYPE_GENERAL, CommonConstant.MOU_RETURN + CommonConstant.MOU_TYPE_FACTORING, CommonConstant.MOU_RETURN + CommonConstant.MOU_TYPE_DLFN];
      this.requestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE],
                                               UserAccess[CommonConstant.OFFICE_CODE], 
                                               UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE]];
      
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
    if (event.Key == "customer") {
      this.CustNoObj.CustNo = event.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        (response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.AdInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.AdInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
  }
}