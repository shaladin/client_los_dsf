import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { environment } from 'environments/environment';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { CookieService } from 'ngx-cookie';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { String } from 'typescript-string-operations';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-mou-execution-paging-x',
  templateUrl: './mou-execution-paging-x.component.html'
})

export class MouExecutionPagingXComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  requestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  MrMouTypeCode: string;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService, private AdInsHelperService: AdInsHelperService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
    if (params["MrMouTypeCode"] != null) {
      this.MrMouTypeCode = params["MrMouTypeCode"];
    }
  });}

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    const addCritMouType = new CriteriaObj();
    addCritMouType.DataType = "text";
    addCritMouType.propName = "MOU.MR_MOU_TYPE_CODE";
    addCritMouType.restriction = AdInsConstant.RestrictionEq;
    addCritMouType.value = this.MrMouTypeCode;
    this.inputPagingObj.addCritInput.push(addCritMouType);

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/impl/ucpaging/mou/V2/searchMouRequestForExecXV2.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/V2/searchMouRequestForExecXV2.json";

      this.inputPagingObj.isJoinExAPI = true;

      this.requestTaskModel.ProcessKey = String.Format(CommonConstant.WF_MOU, (this.MrMouTypeCode != CommonConstant.MOU_TYPE_DLFN ? this.MrMouTypeCode : CommonConstant.DF));
      this.requestTaskModel.TaskDefinitionKey = String.Format(CommonConstant.MOU_EXECUTION, this.MrMouTypeCode);
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
    else{
      this.inputPagingObj._url = "./assets/impl/ucpaging/mou/searchMouRequestForExecX.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/searchMouRequestForExecX.json";
    }
  }

  getEvent(event) {
    console.log(event)
    if (event.Key == "exe") {
      var obj = {
        MouCustId: event.RowObj.MouCustId,
        MouCustNo: event.RowObj.MouCustNo
      }
      this.http.post(URLConstantX.CheckMouActiveR2, obj).subscribe(
        response => {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_EXECUTION_DETAIL], { "MouCustId": event.RowObj.MouCustId,  "WfTaskListId": environment.isCore ? event.RowObj.Id : event.RowObj.WfTaskListId });
        }
      );
    } else if (event.Key == "customer") {
      let custObj = { CustNo: event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
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
