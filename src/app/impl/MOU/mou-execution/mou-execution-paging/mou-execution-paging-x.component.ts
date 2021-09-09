import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { CookieService } from 'ngx-cookie';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-mou-execution-paging-x',
  templateUrl: './mou-execution-paging-x.component.html'
})

export class MouExecutionPagingXComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  requestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    if (environment.isCore) {
      this.inputPagingObj._url = "./assets/impl/ucpaging/mou/V2/searchMouRequestForExecXV2.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/V2/searchMouRequestForExecXV2.json";

      this.inputPagingObj.isJoinExAPI = true;

      this.requestTaskModel.ProcessKeys = [CommonConstant.WF_MOU_GENERAL, CommonConstant.WF_MOU_FACTORING, CommonConstant.WF_MOU_DLFN];
      this.requestTaskModel.OfficeCode = UserAccess[CommonConstant.OFFICE_CODE];
      this.requestTaskModel.TaskDefinitionKey = CommonConstant.MOU_EXECUTION;
      this.requestTaskModel.RoleCode = UserAccess[CommonConstant.ROLE_CODE];
      this.requestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.OFFICE_CODE]];

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
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_EXECUTION_DETAIL], { "MouCustId": event.RowObj.MouCustId, "WfTaskListId": environment.isCore ? event.RowObj.Id : event.RowObj.WfTaskListId });
        }
      );
    } else if (event.Key == "customer") {
      let custNo = event.RowObj.CustNo;
      let custObj = { CustNo: custNo };
      let custId: number;
      let mrCustTypeCode: string;
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        (response) => {
          custId = response['CustId'];
          mrCustTypeCode = response['MrCustTypeCode'];

          if (mrCustTypeCode == CommonConstant.CustTypeCompany) {
            AdInsHelper.OpenCustomerCoyViewByCustId(custId);
          }

          if (mrCustTypeCode == CommonConstant.CustTypePersonal) {
            AdInsHelper.OpenCustomerViewByCustId(custId);
          }
        });
    }
  }
}
