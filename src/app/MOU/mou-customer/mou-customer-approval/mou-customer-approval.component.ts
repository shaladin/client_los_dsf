import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ApprovalReqObj, UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { environment } from 'environments/environment';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { String } from 'typescript-string-operations';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-mou-customer-approval',
  templateUrl: './mou-customer-approval.component.html',
})
export class MouCustomerApprovalComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  arrCrit: Array<CriteriaObj>;
  requestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  apvReqObj: ApprovalReqObj = new ApprovalReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();
  user: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));;

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService, private toastr: NGXToastrService, private apvTaskService: ApprovalTaskService) { }

  ngOnInit() {

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchMouCustomerApprovalV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchMouCustomerApprovalV2.json";

      this.inputPagingObj.isJoinExAPI = true;

      this.apvReqObj.CategoryCodes = [CommonConstant.CAT_CODE_MOU_APV_GENERAL, CommonConstant.CAT_CODE_MOU_APV_FACTORING, CommonConstant.CAT_CODE_MOU_APV_DLFN]
      this.apvReqObj.Username = this.user.UserName;
      this.apvReqObj.RoleCode = this.user.RoleCode;
      this.integrationObj.baseUrl = URLConstant.GetListOSApvTaskByCategoryCodeAndCurrentUserIdOrMainUserIdAndRoleCode;
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
  
  getEvent(event) {
    let custId: number;
    let mrCustTypeCode: string;
    var isRoleAssignment = event.RowObj.IsRoleAssignment.toString();
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
    if (event.Key == "Process") {
      if(isRoleAssignment != CommonConstant.TRUE){
        if (String.Format("{0:L}", event.RowObj.CurrentUser) != String.Format("{0:L}", this.user.UserName)) {
          this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
        } else {
          switch (event.RowObj.MouType) {
            case CommonConstant.MOU_TYPE_FACTORING:
                AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_APPRV_FCTR],{ "MouCustId": event.RowObj.MouCustId, "TaskId" : event.RowObj.TaskId, "InstanceId": event.RowObj.InstanceId ,"ApvReqId": event.RowObj.ApvReqId, "IsRoleAssignment": isRoleAssignment});
                break;
            case CommonConstant.MOU_TYPE_GENERAL:
                AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_APPRV_GENERAL],{ "MouCustId": event.RowObj.MouCustId, "TaskId" : event.RowObj.TaskId, "InstanceId": event.RowObj.InstanceId ,"ApvReqId": event.RowObj.ApvReqId, "IsRoleAssignment": isRoleAssignment});
                break;
            case CommonConstant.MOU_TYPE_DLFN:
                AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_APPRV_GENERAL],{ "MouCustId": event.RowObj.MouCustId, "TaskId" : event.RowObj.TaskId, "InstanceId": event.RowObj.InstanceId ,"ApvReqId": event.RowObj.ApvReqId, "IsRoleAssignment": isRoleAssignment});
                break;
          }
        }
      }
      else{
        if (event.RowObj.CurrentUser == "-") {
          this.apvTaskService.ClaimApvTask(event.RowObj.TaskId);
          switch (event.RowObj.MouType) {
            case CommonConstant.FACTORING:
                AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_APPRV_FCTR],{ "MouCustId": event.RowObj.MouCustId, "TaskId" : event.RowObj.TaskId, "InstanceId": event.RowObj.InstanceId ,"ApvReqId": event.RowObj.ApvReqId, "IsRoleAssignment": isRoleAssignment});
                break;
            case CommonConstant.GENERAL:
                AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_APPRV_GENERAL],{ "MouCustId": event.RowObj.MouCustId, "TaskId" : event.RowObj.TaskId, "InstanceId": event.RowObj.InstanceId ,"ApvReqId": event.RowObj.ApvReqId, "IsRoleAssignment": isRoleAssignment});
                break;
            case CommonConstant.FINANCING:
                AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_APPRV_GENERAL],{ "MouCustId": event.RowObj.MouCustId, "TaskId" : event.RowObj.TaskId, "InstanceId": event.RowObj.InstanceId ,"ApvReqId": event.RowObj.ApvReqId, "IsRoleAssignment": isRoleAssignment});
                break;
          }
        }
        else{
          switch (event.RowObj.MouType) {
            case CommonConstant.FACTORING:
                AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_APPRV_FCTR],{ "MouCustId": event.RowObj.MouCustId, "TaskId" : event.RowObj.TaskId, "InstanceId": event.RowObj.InstanceId ,"ApvReqId": event.RowObj.ApvReqId, "IsRoleAssignment": isRoleAssignment});
                break;
            case CommonConstant.GENERAL:
                AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_APPRV_GENERAL],{ "MouCustId": event.RowObj.MouCustId, "TaskId" : event.RowObj.TaskId, "InstanceId": event.RowObj.InstanceId ,"ApvReqId": event.RowObj.ApvReqId, "IsRoleAssignment": isRoleAssignment});
                break;
            case CommonConstant.FINANCING:
                AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_APPRV_GENERAL],{ "MouCustId": event.RowObj.MouCustId, "TaskId" : event.RowObj.TaskId, "InstanceId": event.RowObj.InstanceId ,"ApvReqId": event.RowObj.ApvReqId, "IsRoleAssignment": isRoleAssignment});
                break;
          }
        }
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
