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
    await this.CheckApvResultExp();

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

  async GetAppData() {
    await this.http.post<AppObj>(URLConstant.GetAppById, {Id : this.AppId}).toPromise().then(
      (response) => {
        this.AppObj = response;
      }
    );
  }
  async CheckApvResultExp() {
    //get bis date
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
    await this.GetAppData();
    if (this.AppObj.CrdApvResultExpDt != null && this.AppObj.CrdApvResultExpDt != undefined) {
      if (this.businessDt > new Date(this.AppObj.CrdApvResultExpDt)) {
        this.isNeedExtension = true;
        this.toastRef = this.toastrSvc.error(null, "Need Extension", {
          disableTimeOut: true,
          tapToDismiss: false,
          closeButton: true
        });
      }
    }
  }

  testData() {}

  SaveForm() {

    if(this.isNeedExtension){
      this.toastr.typeErrorCustom("Need Extension");
      return;
    }

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
      }
    } else {
      this.toastr.typeErrorCustom("Please submit purchase order first!");
    }

    if (IsSave) {
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
