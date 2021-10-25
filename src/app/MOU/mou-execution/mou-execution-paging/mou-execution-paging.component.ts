import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { environment } from 'environments/environment';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { CookieService } from 'ngx-cookie';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-mou-execution-paging',
  templateUrl: './mou-execution-paging.component.html',
  styleUrls: ['./mou-execution-paging.component.scss']
})
export class MouExecutionPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  requestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService, private AdInsHelperService: AdInsHelperService) { }

  ngOnInit() {
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouRequestForExec.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouRequestForExec.json";

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchMouRequestForExecV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchMouRequestForExecV2.json";

      this.inputPagingObj.isJoinExAPI = true;

      this.requestTaskModel.ProcessKeys = [CommonConstant.WF_MOU_GENERAL, CommonConstant.WF_MOU_FACTORING, CommonConstant.WF_MOU_DLFN];
      this.requestTaskModel.TaskDefinitionKeys = [CommonConstant.MOU_EXECUTION + CommonConstant.MOU_TYPE_GENERAL, CommonConstant.MOU_EXECUTION + CommonConstant.MOU_TYPE_FACTORING,CommonConstant.MOU_EXECUTION + CommonConstant.MOU_TYPE_DLFN];
      this.requestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.OFFICE_CODE],
                                               UserAccess[CommonConstant.OFFICE_CODE], 
                                               UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.requestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "MouCustNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.IntegrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
  }

  getEvent(event) {
    console.log(event)
    if (event.Key == "exe") {
      var obj = {
        MouCustId: event.RowObj.MouCustId,
        MouCustNo: event.RowObj.MouCustNo
      }
      this.http.post(URLConstant.CheckMouActiveR2, obj).subscribe(
        response => {
          AdInsHelper.RedirectUrl(this.router, ["/Mou/Execution/Detail"], { "MouCustId": event.RowObj.MouCustId, "WfTaskListId": event.RowObj.WfTaskListId });
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
