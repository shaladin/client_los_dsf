import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { PreGoLiveMainObj } from 'app/shared/model/PreGoLiveMainObj.Model';
import { PreGoLiveObj } from 'app/shared/model/PreGoLiveObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { forkJoin } from 'rxjs';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { ReqGetRfaLogByTrxNoAndApvCategoryObj } from 'app/shared/model/Request/NAP/PreGoLive/ReqGetRfaLogByTrxNoAndApvCategoryObj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { RfaObj } from 'app/shared/model/Approval/RfaObj.Model';

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
  appTC: AppTCObj;
  TaskListId: number;
  PreGoLiveMainObj: PreGoLiveMainObj = new PreGoLiveMainObj();
  PreGoLiveObj: PreGoLiveObj = new PreGoLiveObj();
  AgrmntObj: AgrmntObj = new AgrmntObj();
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);

  IsCheckedAll: boolean = false;


  MainInfoForm = this.fb.group({
    AgrmntCreatedDt: ['', Validators.required],
    EffectiveDt: ['', Validators.required],
    Notes: ['', Validators.required],
    ApprovalStatus: [''],
    AdditionalInterestPaidBy: ['',Validators.required]
  })
  listAppTCObj: ListAppTCObj;
  ListAppTCObj: ListAppTCObj;

  count1: number = 0;
  ListRfaLogObj: Array<RfaObj>;
  hasApproveFinal: boolean = false;
  hasRejectFinal: boolean = false;
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
        this.InputApprovalHistoryObj.EnvUrl = environment.FoundationR3Url;
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
    this.claimTaskService.ClaimTask(this.TaskListId);
    if (this.BizTemplateCode == CommonConstant.CFNA) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfoPreGoLiveCFNA.json";
      this.viewGenericObj.viewEnvironment = environment.losUrl;
      this.viewGenericObj.ddlEnvironments = [
        {
          name: "AppNo",
          environment: environment.losR3Web
        },
        {
          name: "LeadNo",
          environment: environment.losR3Web
        },
        {
          name: "AgrmntNo",
          environment: environment.losR3Web
        },
        {
          name: "MouCustNo",
          environment: environment.losR3Web
        },
      ];
    } else {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfoPreGoLive.json";
    }
    
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
    await this.getAddInterestPaidBy();
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
  }

  RFA() {
    var businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    this.ListAppTCObj = new ListAppTCObj();
    this.ListAppTCObj["ListAppTcObj"] = new Array();
    for (var i = 0; i < this.MainInfoForm.value.TCList["length"]; i++) {
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.MainInfoForm.value.TCList[i].AppId;
      this.appTC.AppTcId = this.MainInfoForm.value.TCList[i].AppTcId;
      this.appTC.TcCode = this.MainInfoForm.value.TCList[i].TcCode;
      this.appTC.TcName = this.MainInfoForm.value.TCList[i].TcName;
      this.appTC.PriorTo = this.MainInfoForm.value.TCList[i].PriorTo;
      this.appTC.IsChecked = this.MainInfoForm.getRawValue().TCList[i].IsChecked;
      this.appTC.ExpiredDt = this.MainInfoForm.getRawValue().TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.MainInfoForm.value.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.MainInfoForm.getRawValue().TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.MainInfoForm.value.TCList[i].CheckedDt;
      this.appTC.Notes = this.MainInfoForm.value.TCList[i].Notes;
      this.appTC.RowVersion = this.MainInfoForm.value.TCList[i].RowVersion;

      var prmsDt = new Date(this.appTC.PromisedDt);
      var prmsDtForm = this.MainInfoForm.value.TCList[i].PromisedDt;

      if (this.appTC.IsChecked == false) {
        if (prmsDtForm != null) {
          if (prmsDt < businessDt) {
            this.toastr.warningMessage("Promise Date for " + this.appTC.TcName + " can't be lower than Business Date");
            return;
          }
        }
      }
      this.ListAppTCObj["ListAppTcObj"].push(this.appTC);
    }
    this.http.post(URLConstant.EditAppTc, this.ListAppTCObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_PGL_REQ_APPRVL],{ "AgrmntId": this.AgrmntId, "AppId": this.AppId, "AgrmntNo": this.AgrmntNo, "TaskListId": this.TaskListId });
        this.toastr.successMessage(response['message']);

      });

  }

  SaveForm(flag = true) {
    var businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));

    this.listAppTCObj = new ListAppTCObj();
    this.listAppTCObj.AppTCObj = new Array();

    if (this.BizTemplateCode != CommonConstant.DF) {
      for (var i = 0; i < this.MainInfoForm.value.TCList["length"]; i++) {
        this.appTC = new AppTCObj();
        this.appTC.AppId = this.MainInfoForm.value.TCList[i].AppId;
        this.appTC.AppTcId = this.MainInfoForm.value.TCList[i].AppTcId;
        this.appTC.TcCode = this.MainInfoForm.value.TCList[i].TcCode;
        this.appTC.TcName = this.MainInfoForm.value.TCList[i].TcName;
        this.appTC.PriorTo = this.MainInfoForm.value.TCList[i].PriorTo;
        this.appTC.IsChecked = this.MainInfoForm.getRawValue().TCList[i].IsChecked;
        this.appTC.ExpiredDt = this.MainInfoForm.getRawValue().TCList[i].ExpiredDt;
        this.appTC.IsMandatory = this.MainInfoForm.value.TCList[i].IsMandatory;
        this.appTC.PromisedDt = this.MainInfoForm.getRawValue().TCList[i].PromisedDt;
        this.appTC.CheckedDt = this.MainInfoForm.value.TCList[i].CheckedDt;
        this.appTC.Notes = this.MainInfoForm.value.TCList[i].Notes;
        this.appTC.RowVersion = this.MainInfoForm.value.TCList[i].RowVersion;
  
        var prmsDt = new Date(this.appTC.PromisedDt);
        var prmsDtForm = this.MainInfoForm.value.TCList[i].PromisedDt;
  
        if (this.appTC.IsChecked == false) {
          if (prmsDtForm != null) {
            if (prmsDt < businessDt) {
              this.toastr.warningMessage("Promise Date for " + this.appTC.TcName + " can't be lower than Business Date");
              return;
            }
          }
        }
        this.listAppTCObj.AppTCObj.push(this.appTC);
  
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
    this.PreGoLiveObj.rAppTcObj = this.listAppTCObj.AppTCObj;
    this.PreGoLiveObj.preGoLiveObj = this.PreGoLiveMainObj;
    this.PreGoLiveObj.AdditionalInterestPaidBy = this.MainInfoForm.controls.AdditionalInterestPaidBy.value;
    this.PreGoLiveObj.TaskListId = this.TaskListId;
    this.PreGoLiveObj.FlagResume = flag;

    this.http.post(URLConstant.AddPreGoLive, this.PreGoLiveObj).subscribe(
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

}
