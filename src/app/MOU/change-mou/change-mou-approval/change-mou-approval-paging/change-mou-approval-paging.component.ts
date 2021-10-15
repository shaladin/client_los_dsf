import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ApprovalReqObj, UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';
import { String } from 'typescript-string-operations';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-change-mou-approval-paging',
  templateUrl: './change-mou-approval-paging.component.html'
})
export class ChangeMouApprovalPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  arrCrit: Array<CriteriaObj>;
  apvReqObj: ApprovalReqObj = new ApprovalReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();
  UserContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService, private toastr: NGXToastrService, private apvTaskService: ApprovalTaskService) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/mou/searchChangeMouApv.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchChangeMouApv.json";

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/mou/V2/searchChangeMouApvV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/V2/searchChangeMouApvV2.json";

      this.inputPagingObj.isJoinExAPI = true;

      this.apvReqObj.CategoryCode = CommonConstant.CAT_CODE_CHG_MOU_APV;
      this.apvReqObj.Username = this.UserContext.UserName;
      this.apvReqObj.RoleCode = this.UserContext.RoleCode;
      this.integrationObj.baseUrl = URLConstant.GetListOSApvTaskByCategoryCodeAndCurrentUserIdOrMainUserIdAndRoleCode;
      this.integrationObj.requestObj = this.apvReqObj;
      this.integrationObj.leftColumnToJoin = "TrxNo";
      this.integrationObj.rightColumnToJoin = "TransactionNo";
      this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.integrationObj; 
    }
  }

  getEvent(event) {
    let custId: number;
    let mrCustTypeCode: string;
    var isRoleAssignment = event.RowObj.IsRoleAssignment.toString();
    if (event.Key == "customer") {
      let CustNoObj = { CustNo: event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, CustNoObj).subscribe(
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
    else if (event.Key == "Process") {
      if(isRoleAssignment != CommonConstant.TRUE){
        if (String.Format("{0:L}", event.RowObj.CurrentUser) != String.Format("{0:L}", this.UserContext.UserName)) {
          this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
        } 
      }
      else if (event.RowObj.CurrentUser == "-") {
          this.apvTaskService.ClaimApvTask(event.RowObj.TaskId);
      }
      
      switch (event.RowObj.MouType) {
        case CommonConstant.MOU_TYPE_FACTORING:
            AdInsHelper.RedirectUrl(this.router,[NavigationConstant.CHANGE_MOU_APV_DETAIL_FCTR],{ "MouCustId": event.RowObj.MouCustId, "ChangeMouTrxId" : event.RowObj.ChangeMouTrxId, "TaskId": event.RowObj.TaskId , "TrxNo": event.RowObj.TrxNo, "InstanceId": event.RowObj.InstanceId, "ApvReqId": event.RowObj.ApvReqId, "PageTitle": event.RowObj.MouTypeDescr, "ChangeMouCustId": event.RowObj.ChangeMouCustId, "MouType": event.RowObj.MouType, "TrxType": event.RowObj.TrxType, "IsRoleAssignment": isRoleAssignment});
            break;
        case CommonConstant.MOU_TYPE_GENERAL:
            AdInsHelper.RedirectUrl(this.router,[NavigationConstant.CHANGE_MOU_APV_DETAIL_GEN],{ "MouCustId": event.RowObj.MouCustId, "ChangeMouTrxId" : event.RowObj.ChangeMouTrxId, "TaskId": event.RowObj.TaskId , "TrxNo": event.RowObj.TrxNo, "InstanceId": event.RowObj.InstanceId, "ApvReqId": event.RowObj.ApvReqId, "PageTitle": event.RowObj.MouTypeDescr, "ChangeMouCustId": event.RowObj.ChangeMouCustId, "MouType": event.RowObj.MouType, "TrxType": event.RowObj.TrxType, "IsRoleAssignment": isRoleAssignment});
            break;
        case CommonConstant.MOU_TYPE_DLFN:
            AdInsHelper.RedirectUrl(this.router,[NavigationConstant.CHANGE_MOU_APV_DETAIL_FIN],{ "MouCustId": event.RowObj.MouCustId, "ChangeMouTrxId" : event.RowObj.ChangeMouTrxId, "TaskId": event.RowObj.TaskId , "TrxNo": event.RowObj.TrxNo, "InstanceId": event.RowObj.InstanceId, "ApvReqId": event.RowObj.ApvReqId, "PageTitle": event.RowObj.MouTypeDescr, "ChangeMouCustId": event.RowObj.ChangeMouCustId, "MouType": event.RowObj.MouType, "TrxType": event.RowObj.TrxType, "IsRoleAssignment": isRoleAssignment});
            break;
      }   
    }
    else if (event.Key == "HoldTask") {
      if (String.Format("{0:L}", event.RowObj.CurrentUser) != String.Format("{0:L}", this.UserContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
      } 
      else {
        this.apvTaskService.HoldApvTask(event.RowObj.TaskId);
      }
    }
    else if (event.Key == "TakeBack") {
      if (String.Format("{0:L}", event.RowObj.MainUser) != String.Format("{0:L}", this.UserContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_TAKE_BACK);
      } else {
        this.apvTaskService.TakeBackApvTask(event.RowObj.TaskId, event.RowObj.MainUser);
      }
    }
    else if (event.Key == "UnClaim") {
      if (String.Format("{0:L}", event.RowObj.CurrentUser) != String.Format("{0:L}", this.UserContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_UNCLAIM);
      } else {
        this.apvTaskService.UnclaimApvTask(event.RowObj.TaskId);
      }
    }
  }
}
