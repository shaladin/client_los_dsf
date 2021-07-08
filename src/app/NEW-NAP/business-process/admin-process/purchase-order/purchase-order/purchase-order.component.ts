import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { forkJoin } from 'rxjs';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ToastrService } from 'ngx-toastr';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html'
})
export class PurchaseOrderComponent implements OnInit {
  readonly urlDetail: string = NavigationConstant.NAP_ADM_PRCS_PO_PO_EXT_DETAIL;
  lobCode: string;
  AppId: number;
  AgrmntId: number;
  TaskListId: number;
  arrValue: Array<number> = [];
  AppAssetList = [];
  tcForm: FormGroup = this.fb.group({
  });
  isDmsReady: boolean = false;
  dmsObj: DMSObj;
  agrNo: string;
  custNo: string;
  appNo: string;
  dmsAppObj: DMSObj;
  mouCustNo: string;
  isDmsAppReady: boolean;
  SysConfigResultObj : ResSysConfigResultObj = new ResSysConfigResultObj();
  isNeedExtension: boolean = false;
  businessDt: Date;
  AppObj: AppObj = new AppObj();
  toastRef: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService, private router: Router, private cookieService: CookieService, private claimTaskService: ClaimTaskService, private toastrSvc: ToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["TaskListId"] != null) {
        this.TaskListId = params["TaskListId"];
      }
      if (params["LobCode"] != null) {
        this.lobCode = params["LobCode"];
      }
    });
  }

  async ngOnInit() {

    this.arrValue.push(this.AgrmntId);
    var appAssetObj = {
      Id: this.AgrmntId
    }
    this.claimTaskService.ClaimTask(this.TaskListId);
    this.http.post(URLConstant.GetAppAssetListByAgrmntId, appAssetObj).subscribe(
      (response) => {
        this.AppAssetList = response[CommonConstant.ReturnObj];
      });
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response
      });
    await this.InitDms();
  }

  async InitDms() {
    if(this.SysConfigResultObj.ConfigValue == '1'){
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      this.dmsAppObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeAgr;
  
      this.dmsAppObj.User = currentUserContext.UserName;
      this.dmsAppObj.Role = currentUserContext.RoleCode;
      this.dmsAppObj.ViewCode = CommonConstant.DmsViewCodeApp;
  
      var agrObj = { Id: this.AgrmntId };
      var appObj = { Id: this.AppId };
  
      let getAgr = await this.http.post(URLConstant.GetAgrmntByAgrmntId, agrObj)
      let getAppCust = await this.http.post(URLConstant.GetAppCustByAppId, appObj)
      let getApp = await this.http.post(URLConstant.GetAppById, appObj)
      forkJoin([getAgr, getAppCust, getApp]).subscribe(
        (response) => {
          this.agrNo = response[0]['AgrmntNo'];
          this.custNo = response[1]['CustNo'];
          this.appNo = response[2]['AppNo'];
          let mouId = response[2]['MouCustId'];
  
          if (this.custNo != null && this.custNo != '') {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
            this.dmsAppObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
          }
          else {
            this.dmsAppObj.MetadataParent = null;
          }
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoAgr, this.agrNo));
  
          this.dmsAppObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
  
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
          if (mouId != null && mouId != "") {
            this.http.post(URLConstant.GetMouCustById, { Id: mouId }).subscribe(
              (result: MouCustObj) => {
                this.mouCustNo = result.MouCustNo;
                this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.mouCustNo));
                this.dmsAppObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.mouCustNo));
                this.isDmsReady = true;
              }
            )
          }
          else {
            this.isDmsReady = true;
          }
        }
      );
    }
  }

  ngOnDestroy() {
    if(this.toastRef != undefined && this.toastRef != null){
      this.toastrSvc.clear(this.toastRef.toastId);
    }
  }

  checkValidExpDt(ExpirationDate: Date, PoNo: string, flag: boolean): boolean {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let bzDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
    let tempExpDt = new Date(ExpirationDate);
    if (bzDt.getTime() > tempExpDt.getTime()) {
      flag = false;
      throw this.toastr.typeErrorCustom(PoNo + " Need Extension.");
    }
    return flag;
  }

  SetTcForm(): ListAppTCObj{    
    let businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    let listAppTCObj: ListAppTCObj = new ListAppTCObj();
    listAppTCObj.AppTCObj = new Array();
    for (var i = 0; i < this.tcForm.value.TCList["length"]; i++) {
      const tempAppTc = this.tcForm.getRawValue().TCList[i];
      let appTC = new AppTCObj();
      appTC.AppId = tempAppTc.AppId;
      appTC.AppTcId = tempAppTc.AppTcId;
      appTC.TcCode = tempAppTc.TcCode;
      appTC.TcName = tempAppTc.TcName;
      appTC.PriorTo = tempAppTc.PriorTo;
      appTC.IsChecked = tempAppTc.IsChecked;
      appTC.ExpiredDt = tempAppTc.ExpiredDt;
      appTC.IsMandatory = tempAppTc.IsMandatory;
      appTC.PromisedDt = tempAppTc.PromisedDt;
      appTC.CheckedDt = tempAppTc.CheckedDt;
      appTC.IsWaived = tempAppTc.IsWaived;
      appTC.Notes = tempAppTc.Notes;
      appTC.IsAdditional = tempAppTc.IsAdditional;
      appTC.RowVersion = tempAppTc.RowVersion;

      var prmsDt = new Date(appTC.PromisedDt);
      var prmsDtForm = tempAppTc.PromisedDt;
      if (appTC.IsChecked == false) {
        if (prmsDtForm != null) {
          if (prmsDt < businessDt) {
            this.toastr.warningMessage("Promise Date for " + appTC.TcName + " can't be lower than Business Date");
            return;
          }
        }
      }
      listAppTCObj.AppTCObj.push(appTC);
    }

    return listAppTCObj;
  }
  async SaveForm() {
    var IsSave = false;
    if (this.AppAssetList.length != 0) {
      for (let i = 0; i < this.AppAssetList.length; i++) {
        if (this.AppAssetList[i].PurchaseOrderNo == undefined) {
          IsSave = false;
          this.toastr.typeErrorCustom("Please submit purchase order first!");
          break;
        } else {
          IsSave = true;
        }

        if(this.AppAssetList[i].PurchaseOrderExpiredDt){
          IsSave = this.checkValidExpDt(this.AppAssetList[i].PurchaseOrderExpiredDt, this.AppAssetList[i].PurchaseOrderNo, IsSave);
        }
      }
    } else {
      this.toastr.typeErrorCustom("Please submit purchase order first!");
    }

    let listAppTCObj: ListAppTCObj = this.SetTcForm();
    if (IsSave) {
      await this.http.post(URLConstant.EditAppTc, {ListAppTcObj: listAppTCObj.AppTCObj}).toPromise().then(
        (response) => {
          // this.toastr.successMessage(response["Message"]);
          if(response["StatusCode"] != 200){
            throw this.toastr.errorMessage(response["Message"]);
          }
        });
      var workflowModel: WorkflowApiObj = new WorkflowApiObj();
      workflowModel.TaskListId = this.TaskListId;
      workflowModel.ListValue = { "AgrmntId": this.AgrmntId.toString() };


      this.http.post(URLConstant.ResumeWorkflowPurchaseOrder, workflowModel).subscribe(
        (response) => {
          this.AppAssetList = response[CommonConstant.ReturnObj];
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PO_PAGING], {});
          this.toastr.successMessage(response["message"]);
        });
    }
  }
  Cancel() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PO_PAGING], { "BizTemplateCode": BizTemplateCode });
  }
}
