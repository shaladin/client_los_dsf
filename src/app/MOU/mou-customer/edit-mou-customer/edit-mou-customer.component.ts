import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { UcpagingComponent } from '@adins/ucpaging';
import { HttpClient } from '@angular/common/http';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { environment } from 'environments/environment';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { String } from 'typescript-string-operations';

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
  MrMouTypeCode: string;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService, private AdInsHelperService: AdInsHelperService, private route: ActivatedRoute) {   
    this.route.queryParams.subscribe(params => {
    if (params["MrMouTypeCode"] != null) {
      this.MrMouTypeCode = params["MrMouTypeCode"];
    }});
  }

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
    
    const addCritMouType = new CriteriaObj();
    addCritMouType.DataType = "text";
    addCritMouType.propName = "MOU.MR_MOU_TYPE_CODE";
    addCritMouType.restriction = AdInsConstant.RestrictionEq;
    addCritMouType.value = this.MrMouTypeCode;
    this.arrCrit.push(addCritMouType);

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchEditMouCustomerV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchEditMouCustomerV2.json";

      this.inputPagingObj.isJoinExAPI = true;

      this.requestTaskModel.ProcessKey = String.Format(CommonConstant.WF_MOU, (this.MrMouTypeCode != CommonConstant.MOU_TYPE_DLFN ? this.MrMouTypeCode : CommonConstant.DF));
      this.requestTaskModel.TaskDefinitionKey = String.Format(CommonConstant.MOU_RETURN, this.MrMouTypeCode);
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