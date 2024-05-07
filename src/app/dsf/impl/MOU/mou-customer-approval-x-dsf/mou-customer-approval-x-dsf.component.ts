import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { ApprovalReqObj, UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { environment } from 'environments/environment';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { String } from 'typescript-string-operations';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';

@Component({
  selector: 'app-mou-customer-approval-x-dsf',
  templateUrl: './mou-customer-approval-x-dsf.component.html',
  styleUrls: ['./mou-customer-approval-x-dsf.component.css']
})
export class MouCustomerApprovalXDsfComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  arrCrit: Array<CriteriaObj>;
  requestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  apvReqObj: ApprovalReqObj = new ApprovalReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();
  user: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  MrMouTypeCode: string;

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService, private toastr: NGXToastrService, private apvTaskService: ApprovalTaskService, private AdInsHelperService: AdInsHelperService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["MrMouTypeCode"] != null) {
        this.MrMouTypeCode = params["MrMouTypeCode"];
      }});
  }

  ngOnInit() {
    if(environment.isCore){
      if(this.MrMouTypeCode==CommonConstant.MOU_TYPE_FACTORING){
        this.inputPagingObj._url = "./assets/impl/ucpaging/V2/searchMouCustomerApprovalFctrV2.json";
        this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/V2/searchMouCustomerApprovalFctrV2.json";
      }else{
        this.inputPagingObj._url = "./assets/ucpaging/V2/searchMouCustomerApprovalV2.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchMouCustomerApprovalV2.json";
      }

      this.inputPagingObj.isJoinExAPI = true;

      let CategoryCode;
      switch(this.MrMouTypeCode){
        case CommonConstant.MOU_TYPE_FACTORING :
          CategoryCode = CommonConstant.CAT_CODE_MOU_APV_FACTORING;
          break;
        case CommonConstant.MOU_TYPE_GENERAL :
          CategoryCode = CommonConstant.CAT_CODE_MOU_APV_GENERAL;
          break;
        case CommonConstant.MOU_TYPE_DLFN :
          CategoryCode = CommonConstant.CAT_CODE_MOU_APV_DLFN;
          break;
      }

      this.apvReqObj.CategoryCode = CategoryCode;
      this.apvReqObj.Username = this.user.UserName;
      this.apvReqObj.RoleCode = this.user.RoleCode;
      this.apvReqObj.OfficeCode = this.user.OfficeCode;

      this.integrationObj.requestObj = this.apvReqObj;
      this.integrationObj.leftColumnToJoin = "MouCustNo";
      this.integrationObj.rightColumnToJoin = "TransactionNo";
      this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.integrationObj;
    }
    else{
      this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouCustomerApproval.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouCustomerApproval.json";

      this.arrCrit = new Array<CriteriaObj>();
      var critObj = new CriteriaObj();
      critObj.DataType = 'text';
      critObj.restriction = AdInsConstant.RestrictionEq;
      critObj.propName = 'A.MOU_STAT';
      critObj.value = 'MAP';
      this.arrCrit.push(critObj);
      this.inputPagingObj.addCritInput = this.arrCrit;
    }

  }

  async getEvent(event) {
    var isRoleAssignment = event.RowObj.IsRoleAssignment.toString();
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
    else if (event.Key == "Process") {
      if(isRoleAssignment != CommonConstant.TRUE){
        if (String.Format("{0:L}", event.RowObj.CurrentUser) != String.Format("{0:L}", this.user.UserName)) {
          this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
          return;
        }
      }
      else if (event.RowObj.CurrentUser == "-") {
        await this.apvTaskService.ClaimApvTask(event.RowObj.TaskId);
      }

      switch (event.RowObj.MouType) {
        case CommonConstant.FACTORING:
          AdInsHelper.RedirectUrl(this.router,[NavigationConstantDsf.MOU_CUST_APPRV_FCTR_DSF],{ "MouCustId": event.RowObj.MouCustId, "TaskId" : event.RowObj.TaskId, "InstanceId": event.RowObj.InstanceId ,"ApvReqId": environment.isCore ? event.RowObj.RequestId : event.RowObj.ApvReqId});
          break;
        case CommonConstant.GENERAL:
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_APPRV_GENERAL],{ "MouCustId": event.RowObj.MouCustId, "TaskId" : event.RowObj.TaskId, "InstanceId": event.RowObj.InstanceId ,"ApvReqId": environment.isCore ? event.RowObj.RequestId : event.RowObj.ApvReqId});
          break;
        case CommonConstant.FINANCING:
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_APPRV_GENERAL],{ "MouCustId": event.RowObj.MouCustId, "TaskId" : event.RowObj.TaskId, "InstanceId": event.RowObj.InstanceId ,"ApvReqId": environment.isCore ? event.RowObj.RequestId : event.RowObj.ApvReqId});
          break;
      }
    }
    else if (event.Key == "HoldTask") {
      if (String.Format("{0:L}", event.RowObj.CurrentUser) != String.Format("{0:L}", this.user.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
      }
      else {
        this.apvTaskService.HoldApvTask(event.RowObj.TaskId);
      }
    }
    else if (event.Key == "TakeBack") {
      if (String.Format("{0:L}", event.RowObj.MainUser) != String.Format("{0:L}", this.user.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_TAKE_BACK);
      } else {
        this.apvTaskService.TakeBackApvTask(event.RowObj.TaskId, event.RowObj.MainUser);
      }
    }
    else if (event.Key == "UnClaim") {
      if (String.Format("{0:L}", event.RowObj.CurrentUser) != String.Format("{0:L}", this.user.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_UNCLAIM);
      } else {
        this.apvTaskService.UnclaimApvTask(event.RowObj.TaskId);
      }
    }
  }

}
