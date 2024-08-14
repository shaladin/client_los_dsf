import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { forkJoin } from 'rxjs';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { AppObj } from 'app/shared/model/app/app.model';
import { ToastrService } from 'ngx-toastr';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { AgrmntTcObj } from 'app/shared/model/agrmnt-tc/agrmnt-tc-obj.model';
import { ReqSubmitAgrmntTcObj } from 'app/shared/model/agrmnt-tc/req-submit-agrmnt-tc-obj.model';
import { WorkflowApiObj } from 'app/shared/model/workflow/workflow-api-obj.model';
import { environment } from 'environments/environment';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';

@Component({
  selector: 'app-purchase-order-x-dsf',
  templateUrl: './purchase-order-x-dsf.component.html'
})
export class PurchaseOrderXDsfComponent implements OnInit {
  // Self Custom Changes CR Addition Reload Button TC 459737
  readonly urlDetail: string = NavigationConstantDsf.NAP_ADM_PRCS_PO_PO_EXT_DETAIL_DSF;
  // End Self Custom Changes CR Addition Reload Button TC 459737
  lobCode: string;
  AppId: number;
  AgrmntId: number;
  TaskListId: any;
  arrValue: Array<number> = [];
  AppAssetList = [];
  tcForm: FormGroup = this.fb.group({
  });
  isDmsReady: boolean = false;
  dmsObj: DMSObj;
  agrNo: string;
  custNo: string;
  appNo: string;
  mouCustNo: string;
  isDmsAppReady: boolean;
  SysConfigResultObj : ResSysConfigResultObj = new ResSysConfigResultObj();
  isNeedExtension: boolean = false;
  businessDt: Date;
  AppObj: AppObj = new AppObj();
  toastRef: any;
  BizTemplateCode: any;
  wop: string;

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
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  async ngOnInit() {

    this.arrValue.push(this.AgrmntId);
    var appAssetObj = {
      Id: this.AgrmntId
    }
    this.claimTask();
    
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
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeAgr;
  
      var agrObj = { Id: this.AgrmntId };
      var appObj = { Id: this.AppId };
  
      let getAgr = await this.http.post(URLConstant.GetAgrmntByAgrmntId, agrObj)
      let getAppCust = await this.http.post(URLConstant.GetAppCustByAppId, appObj)
      let getApp = await this.http.post(URLConstant.GetAppById, appObj)
      forkJoin([getAgr, getAppCust, getApp]).subscribe(
        (response) => {
          this.agrNo = response[0]['AgrmntNo'];
          this.wop = response[0]['MrWopCode'];
          this.custNo = response[1]['CustNo'];
          this.appNo = response[2]['AppNo'];
          let mouId = response[2]['MouCustId'];
  
          if (this.custNo != null && this.custNo != '') {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
            }
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoAgr, this.agrNo));
  
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadDownloadView));
          if (mouId != null && mouId != "") {
            this.http.post(URLConstant.GetMouCustById, { Id: mouId }).subscribe(
              (result: MouCustObj) => {
                this.mouCustNo = result.MouCustNo;
                this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.mouCustNo));
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

  SetTcForm(): Array<AgrmntTcObj>{    
    let businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    let listAgrmntTcObj: Array<AgrmntTcObj> = new Array<AgrmntTcObj>();
    for (var i = 0; i < this.tcForm.value.TCList["length"]; i++) {
      const tempAgrmntTc = this.tcForm.getRawValue().TCList[i];
      let agrmntTc = new AgrmntTcObj();
      agrmntTc.AgrmntId = tempAgrmntTc.AgrmntId;
      agrmntTc.AgrmntTcId = tempAgrmntTc.AgrmntTcId;
      agrmntTc.TcCode = tempAgrmntTc.TcCode;
      agrmntTc.TcName = tempAgrmntTc.TcName;
      agrmntTc.PriorTo = tempAgrmntTc.PriorTo;
      agrmntTc.IsChecked = tempAgrmntTc.IsChecked;
      agrmntTc.ExpiredDt = tempAgrmntTc.ExpiredDt;
      agrmntTc.IsMandatory = tempAgrmntTc.IsMandatory;
      agrmntTc.PromisedDt = tempAgrmntTc.PromisedDt;
      agrmntTc.CheckedDt = tempAgrmntTc.CheckedDt;
      agrmntTc.IsWaived = tempAgrmntTc.IsWaived;
      agrmntTc.IsExpDtMandatory = tempAgrmntTc.IsExpDtMandatory;
      agrmntTc.IsWaivable = tempAgrmntTc.IsWaivable;
      agrmntTc.Notes = tempAgrmntTc.Notes;
      agrmntTc.IsAdditional = tempAgrmntTc.IsAdditional;

      var prmsDt = new Date(agrmntTc.PromisedDt);
      var prmsDtForm = tempAgrmntTc.PromisedDt;
      if (agrmntTc.IsChecked == false) {
        if (prmsDtForm != null) {
          if (prmsDt < businessDt) {
            this.toastr.warningMessage("Promise Date for " + agrmntTc.TcName + " can't be lower than Business Date");
            return;
          }
        }
      }
      listAgrmntTcObj.push(agrmntTc);
    }

    return listAgrmntTcObj;
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

    let listAgrmntTcObj: Array<AgrmntTcObj> = this.SetTcForm();
    if (IsSave) {
      //RTHREE-322 : Penambahan validasi Purchase Order
      var isPoAmtIsValid = false;
      await this.http.post(URLConstant.ValidatePurchaseOrderAmountByAgrmntId, {Id: this.AgrmntId}).toPromise().then(
        (response) => {
          isPoAmtIsValid = response && response["StatusCode"] == 200;
        }
      );
      if(!isPoAmtIsValid) return;  
      
      var reqSubmitAgrmntTcObj = new ReqSubmitAgrmntTcObj();
      reqSubmitAgrmntTcObj.AgrmntId = this.AgrmntId;
      reqSubmitAgrmntTcObj.ListAgrmntTcObj = listAgrmntTcObj;
      await this.http.post(URLConstant.SubmitAgrmntTc, reqSubmitAgrmntTcObj).toPromise().then(
        (response) => {
          // this.toastr.successMessage(response["Message"]);
          if(response["StatusCode"] != 200){
            throw this.toastr.errorMessage(response["Message"]);
          }
        });
      var workflowModel: WorkflowApiObj = new WorkflowApiObj();
      workflowModel.TaskListId = this.TaskListId;
      workflowModel.ListValue = { "AgrmntId": this.AgrmntId.toString() };

      if(this.wop == CommonConstant.WopAutoDebit)
      {
        this.http.post(URLConstantX.InsertIntoAutoDebitRegistration, {TrxNo: this.agrNo}).subscribe(
          (response) => {
            if(response["StatusCode"] != 200){
              throw this.toastr.errorMessage(response["Message"]);
            }
          }
        )
      }

      let resumeWorkflowPurcharOrderUrl = environment.isCore? URLConstant.ResumeWorkflowPurchaseOrderV2 : URLConstant.ResumeWorkflowPurchaseOrder;
      this.http.post(resumeWorkflowPurcharOrderUrl, workflowModel).subscribe(
        (response) => {
          this.AppAssetList = response[CommonConstant.ReturnObj];
          // Self Custom Changes CR Addition Reload Button TC 459737
          AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_ADM_PRCS_PO_PAGING_DSF], {});
          // End Self Custom Changes CR Addition Reload Button TC 459737
          this.toastr.successMessage(response["message"]);
        });
    }
  }
  Cancel() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE)
    // Self Custom Changes CR Addition Reload Button TC 459737
    AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_ADM_PRCS_PO_PAGING_DSF], { "BizTemplateCode": BizTemplateCode });
    // End Self Custom Changes CR Addition Reload Button TC 459737
  }

  claimTask(){
    if(environment.isCore){
        if(this.TaskListId != "" && this.TaskListId!= undefined){
            this.claimTaskService.ClaimTaskV2(this.TaskListId);
          }
      }
      else if (this.TaskListId > 0) {
         this.claimTaskService.ClaimTask(this.TaskListId);
      }
  }
}
