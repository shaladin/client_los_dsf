import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { ApprovalReqObj, UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';
import { String } from 'typescript-string-operations';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service'
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import {UcpagingComponent} from '@adins/ucpaging';

@Component({
  selector: 'app-change-mou-approval-paging-x',
  templateUrl: './change-mou-approval-paging-x.component.html'
})
export class ChangeMouApprovalPagingXComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  arrCrit: Array<CriteriaObj>;
  apvReqObj: ApprovalReqObj = new ApprovalReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();
  UserContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  MouType = "";
  MouObj: Array<KeyValueObj> = new Array();
  @ViewChild("PagingModal", { read: ViewContainerRef }) pagingModal: ViewContainerRef;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService,
    private toastr: NGXToastrService,
    private apvTaskService: ApprovalTaskService,
    private adInsHelperService: AdInsHelperService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    //CR UATDSFCF-699 - Penambahan Dealer Name
    // Note: logic inputPaging pindah ke function ChangeMouType
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeMouType }).subscribe(
      (response) => {
        this.MouObj = response[CommonConstant.ReturnObj];
        if (this.MouObj.length > 0) {
          this.MouType = this.MouObj[0].Key;
          this.ChangeMouType(this.MouType);
        }
      }
    );
  }

  async getEvent(event) {
    var isRoleAssignment = event.RowObj.IsRoleAssignment.toString();
    if (event.Key == "customer") {
      let CustNoObj = { CustNo: event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, CustNoObj).subscribe(
        (response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
    else if (event.Key == "Process") {
      if(isRoleAssignment != CommonConstant.TRUE){
        if (String.Format("{0:L}", event.RowObj.CurrentUser) != String.Format("{0:L}", this.UserContext.UserName)) {
          this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
          return;
        }
      }
      else if (event.RowObj.CurrentUser == "-") {
        await this.apvTaskService.ClaimApvTask(event.RowObj.TaskId);
      }

      switch (event.RowObj.MouType) {
        case CommonConstant.MOU_TYPE_FACTORING:
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.CHANGE_MOU_APV_DETAIL_FCTR],{ "MouCustId": event.RowObj.MouCustId, "ChangeMouTrxId" : event.RowObj.ChangeMouTrxId, "TaskId": event.RowObj.TaskId , "TrxNo": event.RowObj.TrxNo, "InstanceId": event.RowObj.InstanceId, "ApvReqId": environment.isCore ? event.RowObj.RequestId : event.RowObj.ApvReqId, "PageTitle": event.RowObj.MouTypeDescr, "ChangeMouCustId": event.RowObj.ChangeMouCustId, "MouType": event.RowObj.MouType, "TrxType": event.RowObj.TrxType});
          break;
        case CommonConstant.MOU_TYPE_GENERAL:
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.CHANGE_MOU_APV_DETAIL_GEN],{ "MouCustId": event.RowObj.MouCustId, "ChangeMouTrxId" : event.RowObj.ChangeMouTrxId, "TaskId": event.RowObj.TaskId , "TrxNo": event.RowObj.TrxNo, "InstanceId": event.RowObj.InstanceId, "ApvReqId": environment.isCore ? event.RowObj.RequestId : event.RowObj.ApvReqId, "PageTitle": event.RowObj.MouTypeDescr, "ChangeMouCustId": event.RowObj.ChangeMouCustId, "MouType": event.RowObj.MouType, "TrxType": event.RowObj.TrxType});
          break;
        case CommonConstant.MOU_TYPE_DLFN:
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.CHANGE_MOU_APV_DETAIL_FIN],{ "MouCustId": event.RowObj.MouCustId, "ChangeMouTrxId" : event.RowObj.ChangeMouTrxId, "TaskId": event.RowObj.TaskId , "TrxNo": event.RowObj.TrxNo, "InstanceId": event.RowObj.InstanceId, "ApvReqId": environment.isCore ? event.RowObj.RequestId : event.RowObj.ApvReqId, "PageTitle": event.RowObj.MouTypeDescr, "ChangeMouCustId": event.RowObj.ChangeMouCustId, "MouType": event.RowObj.MouType, "TrxType": event.RowObj.TrxType});
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

  MouTypeChanged(event) {
    this.ChangeMouType(event.target.value);
  }

  ChangeMouType(mouType) {
    this.pagingModal.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UcpagingComponent);
    const component = this.pagingModal.createComponent(componentFactory);

    this.inputPagingObj = new UcPagingObj();

    if(environment.isCore){
      if (mouType == CommonConstant.FACTORING) {
        this.inputPagingObj._url = "./assets/impl/ucpaging/mou/V2/searchChangeMouApvFctrXV2.json";
        this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/V2/searchChangeMouApvFctrXV2.json";
      }else{
        this.inputPagingObj._url = "./assets/impl/ucpaging/mou/V2/searchChangeMouApvXV2.json";
        this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/V2/searchChangeMouApvXV2.json";
      }
      this.inputPagingObj.isJoinExAPI = true;

      this.apvReqObj.CategoryCode = CommonConstant.CAT_CODE_CHG_MOU_APV;
      this.apvReqObj.Username = this.UserContext.UserName;
      this.apvReqObj.RoleCode = this.UserContext.RoleCode;
      this.apvReqObj.OfficeCode = this.UserContext.OfficeCode;
      this.integrationObj.requestObj = this.apvReqObj;
      this.integrationObj.leftColumnToJoin = "TrxNo";
      this.integrationObj.rightColumnToJoin = "TransactionNo";
      this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.integrationObj;
    }else{
      this.inputPagingObj._url = "./assets/ucpaging/mou/searchChangeMouApv.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchChangeMouApv.json";
    }

    component.instance.searchObj = this.inputPagingObj;
    component.instance.callback.subscribe((e) => this.getEvent(e));
  }
}
