import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { AgrmntObj } from 'app/shared/model/agrmnt/agrmnt.model';
import { ListAppTCObj } from 'app/shared/model/list-app-tc-obj.model';
import { AppTCObj } from 'app/shared/model/app-tc-obj.model';
import { PreGoLiveMainObj } from 'app/shared/model/pre-go-live-main-obj.model';
import { PreGoLiveObj } from 'app/shared/model/pre-go-live-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { forkJoin } from 'rxjs';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { ReqGetRfaLogByTrxNoAndApvCategoryObj } from 'app/shared/model/request/nap/pre-go-live/req-get-rfa-log-by-trx-no-and-apv-category-obj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { RfaObj } from 'app/shared/model/approval/rfa-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { AgrmntTcObj } from 'app/shared/model/agrmnt-tc/agrmnt-tc-obj.model';
import { ReqSubmitAgrmntTcObj } from 'app/shared/model/agrmnt-tc/req-submit-agrmnt-tc-obj.model';

@Component({
  selector: 'app-sharing-pre-go-live',
  templateUrl: './pre-go-live.component.html'
})
export class PreGoLiveComponent implements OnInit {

  AppId: number;
  AgrmntId: number;
  AgrmntNo: string;
  result: AgrmntObj;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  agrmntTcObj: AgrmntTcObj;
  TaskListId: any;
  PreGoLiveMainObj: PreGoLiveMainObj = new PreGoLiveMainObj();
  PreGoLiveObj: PreGoLiveObj = new PreGoLiveObj();
  AgrmntObj: AgrmntObj = new AgrmntObj();
  ReqByIdObj: GenericObj = new GenericObj();
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);

  IsCheckedAll: boolean = false;


  MainInfoForm = this.fb.group({
    AgrmntCreatedDt: ['', Validators.required],
    EffectiveDt: ['', Validators.required],
    Notes: ['', Validators.required],
    ApprovalStatus: [''],
    AdditionalInterestPaidBy: ['',Validators.required]
  })
  listAgrmntTcObj: Array<AgrmntTcObj>;

  count1: number = 0;
  ListRfaLogObj: Array<RfaObj>;
  hasApproveFinal: boolean = false;
  hasRejectFinal: boolean = false;
  isHasPO: boolean = false;
  checkPOReady: boolean = false;
  lengthListRfaLogObj: number;
  IsApvReady: boolean = false;
  isDmsReady: boolean;
  dmsObj: DMSObj;
  agrNo: string;
  custNo: string;
  appNo: string;
  dmsAppObj: DMSObj;
  mouCustNo: string;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  SysConfigResultObj : ResSysConfigResultObj = new ResSysConfigResultObj();
  IsGSAddInerestExists: boolean = false;
  ListRmAddInterestPaidByCode: Array<KeyValueObj>;
  BizTemplateCode: string = "";
  businessDt: any;
  PODt: Date = new Date();

  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_PGL_PAGING;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      this.AgrmntId = params["AgrmntId"];
      this.AppId = params["AppId"];
      this.TaskListId = params["TaskListId"];
      this.AgrmntNo = params["AgrmntNo"];

      this.route.queryParams.subscribe(params => {
        if (params["BizTemplateCode"] != null) {
          localStorage.setItem("BizTemplateCode", params["BizTemplateCode"]);
          this.BizTemplateCode = params["BizTemplateCode"];
        }

      });
    });
  }

  async ngOnInit(): Promise<void>{
    this.businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    let reqGetRfaLogByTrxNoAndApvCategoryObj = new ReqGetRfaLogByTrxNoAndApvCategoryObj();
    reqGetRfaLogByTrxNoAndApvCategoryObj.TrxNo = this.AgrmntNo;
    reqGetRfaLogByTrxNoAndApvCategoryObj.ApvCategory = CommonConstant.ApvCategoryPreGoLive;
    this.http.post(URLConstant.GetRfaLogByTrxNoAndApvCategory, reqGetRfaLogByTrxNoAndApvCategoryObj).subscribe(
      (response) => {
        this.ListRfaLogObj = response["ListRfaLogObj"];
        this.lengthListRfaLogObj = this.ListRfaLogObj.length - 1;
        this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
        this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
        for (let i = 0; i < this.ListRfaLogObj.length; i++) {
          if (this.ListRfaLogObj[i]["ApvCategory"] == CommonConstant.ApvCategoryPreGoLive) {
            this.InputApprovalHistoryObj.RequestId = this.ListRfaLogObj[i].RfaNo
            if (this.ListRfaLogObj[i].ApvStat == "ApproveFinal") {
              this.IsCheckedAll = true;
              this.hasApproveFinal = true;
            }
          }
        }
        this.IsApvReady = true;
      });
    this.claimTask();
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfoPreGoLive.json";
    
    var agrmntObj = {
      Id: this.AgrmntId
    }
    this.http.post(URLConstant.GetAgrmntByAgrmntId, agrmntObj).subscribe(
      (response: AgrmntObj) => {
        this.result = response;
        this.MainInfoForm.patchValue({
          AgrmntCreatedDt: formatDate(this.result.AgrmntCreatedDt, 'yyyy-MM-dd', 'en-US'),
          EffectiveDt: formatDate(this.result.EffectiveDt, 'yyyy-MM-dd', 'en-US'),
        })
        this.AgrmntId = this.result.AgrmntId;
        this.AppId = this.result.AppId;
      });
      await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
        (response) => {
          this.SysConfigResultObj = response
        });
    await this.getPODate();
    await this.getAddInterestPaidBy();
    await this.InitDms();
  }

  async getPODate(){
    this.ReqByIdObj.Id = this.AgrmntId;
    this.http.post(URLConstant.GetPurchaseOrderHByAgrmntId, this.ReqByIdObj).subscribe(
      (response: AgrmntObj) => {
        if(response["PurchaseOrderHId"] != 0){
          this.PODt = response["PurchaseOrderDt"];
          this.isHasPO = true;
        }
      });
    this.checkPOReady = true;
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


  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

  ReceiveIsChecked(ev) {
    if (this.ListRfaLogObj.length != 0) {
      if (this.ListRfaLogObj[this.lengthListRfaLogObj].ApvStat == "RejectFinal") {
        this.IsCheckedAll = false;
        return;
      }
    }
    if (this.hasApproveFinal) {
      return;
    }
    else {
      this.IsCheckedAll = ev;
    }

    if(this.IsCheckedAll){
      this.MainInfoForm.controls.Notes.setValidators(Validators.required);
      this.MainInfoForm.controls.Notes.updateValueAndValidity();
      this.MainInfoForm.controls.AdditionalInterestPaidBy.setValidators(Validators.required);
      this.MainInfoForm.controls.AdditionalInterestPaidBy.updateValueAndValidity();
    }
    else if(!this.IsCheckedAll){
      this.MainInfoForm.controls.Notes.clearValidators();
      this.MainInfoForm.controls.Notes.updateValueAndValidity();
      this.MainInfoForm.controls.AdditionalInterestPaidBy.clearValidators();
      this.MainInfoForm.controls.AdditionalInterestPaidBy.updateValueAndValidity();
    }
  }

  RFA() {
    var businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    this.listAgrmntTcObj = new Array<AgrmntTcObj>();
    for (var i = 0; i < this.MainInfoForm.value.TCList["length"]; i++) {
      this.agrmntTcObj = new AgrmntTcObj();
      this.agrmntTcObj.AgrmntId = this.MainInfoForm.value.TCList[i].AgrmntId;
      this.agrmntTcObj.AgrmntTcId = this.MainInfoForm.value.TCList[i].AgrmntTcId;
      this.agrmntTcObj.TcCode = this.MainInfoForm.value.TCList[i].TcCode;
      this.agrmntTcObj.TcName = this.MainInfoForm.value.TCList[i].TcName;
      this.agrmntTcObj.PriorTo = this.MainInfoForm.value.TCList[i].PriorTo;
      this.agrmntTcObj.IsChecked = this.MainInfoForm.getRawValue().TCList[i].IsChecked;
      this.agrmntTcObj.IsWaived = this.MainInfoForm.getRawValue().TCList[i].IsWaived;
      this.agrmntTcObj.ExpiredDt = this.MainInfoForm.getRawValue().TCList[i].ExpiredDt;
      this.agrmntTcObj.IsMandatory = this.MainInfoForm.value.TCList[i].IsMandatory;
      this.agrmntTcObj.PromisedDt = this.MainInfoForm.getRawValue().TCList[i].PromisedDt;
      this.agrmntTcObj.CheckedDt = this.MainInfoForm.value.TCList[i].CheckedDt;
      this.agrmntTcObj.Notes = this.MainInfoForm.value.TCList[i].Notes;
      this.agrmntTcObj.IsAdditional = this.MainInfoForm.value.TCList[i].IsAdditional;
      this.agrmntTcObj.IsExpDtMandatory = this.MainInfoForm.value.TCList[i].IsExpDtMandatory;
      this.agrmntTcObj.IsWaivable = this.MainInfoForm.value.TCList[i].IsWaivable;

      var prmsDt = new Date(this.agrmntTcObj.PromisedDt);
      var prmsDtForm = this.MainInfoForm.value.TCList[i].PromisedDt;

      if (this.agrmntTcObj.IsChecked == false) {
        if (prmsDtForm != null) {
          if (prmsDt < businessDt) {
            this.toastr.warningMessage("Promise Date for " + this.agrmntTcObj.TcName + " can't be lower than Business Date");
            return;
          }
        }
      }
      this.listAgrmntTcObj.push(this.agrmntTcObj);
    }

    var reqSubmitAgrmntTcObj = new ReqSubmitAgrmntTcObj();
    reqSubmitAgrmntTcObj.AgrmntId = this.AgrmntId;
    reqSubmitAgrmntTcObj.ListAgrmntTcObj = this.listAgrmntTcObj;

    this.http.post(URLConstant.SubmitAgrmntTc, reqSubmitAgrmntTcObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_PGL_REQ_APPRVL],{ "AgrmntId": this.AgrmntId, "AppId": this.AppId, "AgrmntNo": this.AgrmntNo, "TaskListId": this.TaskListId });
        this.toastr.successMessage(response['message']);

      });

  }

  SaveForm(flag = true) {
    if(!this.IsCheckedAll && this.BizTemplateCode != CommonConstant.DF){
      this.RFA();
      return;
    }

    var businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));

    this.listAgrmntTcObj = new Array<AgrmntTcObj>();
    if (this.BizTemplateCode != CommonConstant.DF) {
      for (var i = 0; i < this.MainInfoForm.value.TCList["length"]; i++) {
        this.agrmntTcObj = new AgrmntTcObj();
        this.agrmntTcObj.AgrmntId = this.MainInfoForm.value.TCList[i].AgrmntId;
        this.agrmntTcObj.AgrmntTcId = this.MainInfoForm.value.TCList[i].AgrmntTcId;
        this.agrmntTcObj.TcCode = this.MainInfoForm.value.TCList[i].TcCode;
        this.agrmntTcObj.TcName = this.MainInfoForm.value.TCList[i].TcName;
        this.agrmntTcObj.PriorTo = this.MainInfoForm.value.TCList[i].PriorTo;
        this.agrmntTcObj.IsChecked = this.MainInfoForm.getRawValue().TCList[i].IsChecked;
        this.agrmntTcObj.IsWaived = this.MainInfoForm.getRawValue().TCList[i].IsWaived;
        this.agrmntTcObj.ExpiredDt = this.MainInfoForm.getRawValue().TCList[i].ExpiredDt;
        this.agrmntTcObj.IsMandatory = this.MainInfoForm.value.TCList[i].IsMandatory;
        this.agrmntTcObj.PromisedDt = this.MainInfoForm.getRawValue().TCList[i].PromisedDt;
        this.agrmntTcObj.CheckedDt = this.MainInfoForm.value.TCList[i].CheckedDt;
        this.agrmntTcObj.Notes = this.MainInfoForm.value.TCList[i].Notes;
        this.agrmntTcObj.IsAdditional = this.MainInfoForm.value.TCList[i].IsAdditional;
        this.agrmntTcObj.IsExpDtMandatory = this.MainInfoForm.value.TCList[i].IsExpDtMandatory;
        this.agrmntTcObj.IsWaivable = this.MainInfoForm.value.TCList[i].IsWaivable;
  
        var prmsDt = new Date(this.agrmntTcObj.PromisedDt);
        var prmsDtForm = this.MainInfoForm.value.TCList[i].PromisedDt;
  
        if (this.agrmntTcObj.IsChecked == false) {
          if (prmsDtForm != null) {
            if (prmsDt < businessDt) {
              this.toastr.warningMessage("Promise Date for " + this.agrmntTcObj.TcName + " can't be lower than Business Date");
              return;
            }
          }
        }
        this.listAgrmntTcObj.push(this.agrmntTcObj);
  
      }

    }

    this.AgrmntObj = new AgrmntObj();
    this.AgrmntObj.AgrmntId = this.AgrmntId;
    this.AgrmntObj.AppId = this.AppId;
    this.AgrmntObj.EffectiveDt = this.MainInfoForm.controls.EffectiveDt.value;
    this.AgrmntObj.AgrmntCreatedDt = this.MainInfoForm.controls.AgrmntCreatedDt.value;

    this.PreGoLiveMainObj.AgrmntId = this.AgrmntId;
    this.PreGoLiveMainObj.AgrmntDt = this.MainInfoForm.controls.AgrmntCreatedDt.value;
    this.PreGoLiveMainObj.EffectiveDt = this.MainInfoForm.controls.EffectiveDt.value;
    this.PreGoLiveMainObj.Notes = this.MainInfoForm.controls.Notes.value;

    this.PreGoLiveObj.rAgrmntTC = this.AgrmntObj;
    this.PreGoLiveObj.ListAgrmntTcObj = this.listAgrmntTcObj;
    this.PreGoLiveObj.preGoLiveObj = this.PreGoLiveMainObj;
    this.PreGoLiveObj.AdditionalInterestPaidBy = this.MainInfoForm.controls.AdditionalInterestPaidBy.value;
    this.PreGoLiveObj.TaskListId = this.TaskListId;
    this.PreGoLiveObj.FlagResume = flag;

    let addPreGoLiveUrl = environment.isCore? URLConstant.AddPreGoLiveV2 : URLConstant.AddPreGoLive;
    this.http.post(addPreGoLiveUrl, this.PreGoLiveObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router,[this.CancelLink],{});
        this.toastr.successMessage(response['message']);

      });

  }

  async getAddInterestPaidBy() {
    await this.http.post(URLConstant.GetGeneralSettingByCode, { Code: CommonConstant.GsDiffdaysglveff }).toPromise().then(
      (response) => {
        if (response["GsValue"]) this.IsGSAddInerestExists = true;
      }
    );
    if (!this.IsGSAddInerestExists) return;


    this.MainInfoForm.controls['AdditionalInterestPaidBy'].setValidators([Validators.required]);
    this.MainInfoForm.controls['AdditionalInterestPaidBy'].updateValueAndValidity();
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAdditionalInterestPaidBy }).toPromise().then(
      (response) => {
        this.ListRmAddInterestPaidByCode = response[CommonConstant.ReturnObj];
      }
    );
  }

  claimTask(){
    if(environment.isCore){
        if(this.TaskListId != "" && this.TaskListId!= undefined){
            this.claimTaskService.ClaimTaskV2(this.TaskListId);
        }
      }
      else if (this.TaskListId > 0) {
         this.claimTaskService.ClaimTask(this.TaskListId);
      }
  }
}
