import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { PreGoLiveMainObj } from 'app/shared/model/PreGoLiveMainObj.Model';
import { PreGoLiveObjX } from 'app/impl/shared/model/PreGoLiveObjX.Model';
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
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/RefReason/ReqGetByTypeCodeObj.Model';
import { RefPayFreqObj } from 'app/shared/model/RefPayFreqObj.model';
import { AppObj } from 'app/shared/model/App/App.Model';

@Component({
  selector: 'app-sharing-pre-go-live-x',
  templateUrl: './pre-go-live-x.component.html'
})
export class PreGoLiveXComponent implements OnInit {

  AppId: number;
  AgrmntId: number;
  AgrmntNo: string;
  AgrmntResult: AgrmntObj;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  appTC: AppTCObj;
  TaskListId: any;
  PreGoLiveMainObj: PreGoLiveMainObj = new PreGoLiveMainObj();
  PreGoLiveObj: PreGoLiveObjX = new PreGoLiveObjX();
  AgrmntObj: AgrmntObj = new AgrmntObj();
  ReqByIdObj: GenericObj = new GenericObj();
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);

  IsCheckedAll: boolean = false;


  MainInfoForm = this.fb.group({
    AgrmntCreatedDt: ['', Validators.required],
    EffectiveDt: ['', Validators.required],
    Notes: ['', Validators.required],
    ApprovalStatus: [''],
    AdditionalInterestPaidBy: ['', Validators.required],
    AddIntrstAmt: [0],
    GoLiveEstimated: [''],
  })

  GoLiveApvForm = this.fb.group({})
  listAppTCObj: ListAppTCObj;
  ListAppTCObj: ListAppTCObj;

  ListRfaLogObj: Array<RfaObj>;
  hasApproveFinal: boolean = false;
  isHasPO: boolean = false;
  checkPOReady: boolean = false;
  lengthListRfaLogObj: number;
  IsApvReady: boolean = false;
  isDmsReady: boolean = false;
  dmsObj: DMSObj;
  agrNo: string;
  custNo: string;
  appNo: string;
  dmsAppObj: DMSObj;
  mouCustNo: string;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  IsGSAddInerestExists: boolean = false;
  ListRmAddInterestPaidByCode: Array<KeyValueObj>;
  BizTemplateCode: string = '';
  businessDt: any;
  PODt: Date = new Date();
  MaxEffDt: Date;
  AppObj: AppObj;
  IsNeedApv: boolean = false;
  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_PGL_PAGING;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
    this.route.queryParams.subscribe(params => {
      this.AgrmntId = params['AgrmntId'];
      this.AppId = params['AppId'];
      this.TaskListId = params['TaskListId'];
      this.AgrmntNo = params['AgrmntNo'];

      this.route.queryParams.subscribe(params => {
        if (params['BizTemplateCode'] != null) {
          localStorage.setItem('BizTemplateCode', params['BizTemplateCode']);
          this.BizTemplateCode = params['BizTemplateCode'];
        }

      });
    });
  }

  async ngOnInit(): Promise<void> {
    this.businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    this.MainInfoForm.patchValue({
      GoLiveEstimated: formatDate(this.businessDt, 'yyyy-MM-dd', 'en-US'),
    });
    let reqGetRfaLogByTrxNoAndApvCategoryObj = new ReqGetRfaLogByTrxNoAndApvCategoryObj();
    reqGetRfaLogByTrxNoAndApvCategoryObj.TrxNo = this.AgrmntNo;
    reqGetRfaLogByTrxNoAndApvCategoryObj.ApvCategory = CommonConstant.ApvCategoryPreGoLive;
    this.http.post(URLConstant.GetRfaLogByTrxNoAndApvCategory, reqGetRfaLogByTrxNoAndApvCategoryObj).subscribe(
      (response) => {
        this.ListRfaLogObj = response['ListRfaLogObj'];
        this.lengthListRfaLogObj = this.ListRfaLogObj.length - 1;
        this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
        this.InputApprovalHistoryObj.EnvUrl = environment.FoundationR3Url;
        this.InputApprovalHistoryObj.PathUrl = '/Approval/GetTaskHistory';
        for (let i = 0; i < this.ListRfaLogObj.length; i++) {
          if (this.ListRfaLogObj[i]['ApvCategory'] == CommonConstant.ApvCategoryPreGoLive) {
            this.InputApprovalHistoryObj.RequestId = this.ListRfaLogObj[i].RfaNo
            if (this.ListRfaLogObj[i].ApvStat == 'ApproveFinal') {
              this.IsCheckedAll = true;
              this.hasApproveFinal = true;
            }
          }
        }
        this.IsApvReady = true;
      });
    this.claimTask();
    this.viewGenericObj.viewInput = './assets/ucviewgeneric/viewAgrMainInfoPreGoLive.json';

    const agrmntObj = {
      Id: this.AgrmntId
    }
    await this.http.post(URLConstant.GetAgrmntByAgrmntId, agrmntObj).toPromise().then(
      (response: AgrmntObj) => {
        this.AgrmntResult = response;
        this.MainInfoForm.patchValue({
          AgrmntCreatedDt: formatDate(this.AgrmntResult.AgrmntCreatedDt, 'yyyy-MM-dd', 'en-US'),
          EffectiveDt: formatDate(this.AgrmntResult.EffectiveDt, 'yyyy-MM-dd', 'en-US'),
        })
        this.AgrmntId = this.AgrmntResult.AgrmntId;
        this.AppId = this.AgrmntResult.AppId;
      });

    const agrObj = {Id: this.AgrmntId};
    const appObj = {Id: this.AppId};
    const sysConfigCodeObj = {Code: CommonConstant.ConfigCodeIsUseDms};

    const getAgr = this.http.post(URLConstant.GetAgrmntByAgrmntId, agrObj)
    const getAppCust = this.http.post(URLConstant.GetAppCustByAppId, appObj)
    const getApp = this.http.post<AppObj>(URLConstant.GetAppById, appObj)
    const getSysConfigResult = this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, sysConfigCodeObj);
    await forkJoin([getAgr, getAppCust, getApp, getSysConfigResult]).toPromise().then(
      (response) => {
        this.agrNo = response[0]['AgrmntNo'];
        this.custNo = response[1]['CustNo'];
        this.AppObj = response[2];
        this.SysConfigResultObj = response[3];

        this.appNo = this.AppObj.AppNo;
        const mouId = this.AppObj.MouCustId;
        this.http.post(URLConstant.GetMouCustById, {Id: mouId}).subscribe(
          async (result: MouCustObj) => {
            this.mouCustNo = result.MouCustNo;
            const endDt = new Date(result.EndDt);
            this.MaxEffDt = new Date(result.EndDt);
            let Tenor = this.AgrmntResult.Tenor;
            if (this.AppObj.MrFirstInstTypeCode == CommonConstant.FirstInstTypeAdvance) {
              await this.http.post<RefPayFreqObj>(URLConstant.GetRefPayFreqByPayFreqCode, {Code: this.AppObj.PayFreqCode}).toPromise().then(
                (response) => {
                  Tenor -= response.PayFreqVal;
                }
              );
            }

            this.MaxEffDt.setMonth(endDt.getMonth() - Tenor)
            if (this.MaxEffDt.getDate() != endDt.getDate()) { //untuk perhitungan bulan kabisat / tgl 31 ke tgl 30
              this.MaxEffDt.setDate(0);
            }

          }
        )
      }
    );
    await this.getPODate();
    await this.getAddInterestPaidBy();
    await this.InitDms();
    await this.LoadRefReason();
    if (this.BizTemplateCode == CommonConstant.CF4W || this.BizTemplateCode == CommonConstant.FL4W || this.BizTemplateCode == CommonConstant.CFNA || this.BizTemplateCode == CommonConstant.DF) {
      this.IsNeedApv = true;
      await this.initInputApprovalObj();
    }
  }

  async getPODate() {
    this.ReqByIdObj.Id = this.AgrmntId;
    this.http.post(URLConstant.GetPurchaseOrderHByAgrmntId, this.ReqByIdObj).subscribe(
      (response: AgrmntObj) => {
        if (response['PurchaseOrderHId'] != 0) {
          this.PODt = response['PurchaseOrderDt'];
          this.isHasPO = true;
        }
      });
    this.checkPOReady = true;
  }

  async InitDms() { 
    if (this.SysConfigResultObj.ConfigValue == '1') {
      this.dmsObj = new DMSObj();
      this.dmsAppObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeAgr;

      this.dmsAppObj.User = currentUserContext.UserName;
      this.dmsAppObj.Role = currentUserContext.RoleCode;
      this.dmsAppObj.ViewCode = CommonConstant.DmsViewCodeApp;

      if (this.custNo != '') {
        this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
        this.dmsAppObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
      } else {
        this.dmsAppObj.MetadataParent = null;
      }
      this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
      this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoAgr, this.agrNo));

      this.dmsAppObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));

      this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));

      if (this.AppObj.MouCustId == 0) {
        this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.mouCustNo));
        this.dmsAppObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.mouCustNo));
      }
      this.isDmsReady = true;
    }
  }


  GetCallBack(ev) {
    if (ev.Key == 'ViewProdOffering') {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

  ReceiveIsChecked(ev) {
    if (this.ListRfaLogObj.length != 0) {
      if (this.ListRfaLogObj[this.lengthListRfaLogObj].ApvStat == 'RejectFinal') {
        this.IsCheckedAll = false;
        return;
      }
    }
    if (this.hasApproveFinal) {
      return;
    } else {
      this.IsCheckedAll = ev;
    }
  }

  RFA() {
    const businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    this.ListAppTCObj = new ListAppTCObj();
    let ListAppTcObj = [];

    for (let i = 0; i < this.MainInfoForm.value.TCList["length"]; i++) {
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.MainInfoForm.value.TCList[i].AppId;
      this.appTC.AppTcId = this.MainInfoForm.value.TCList[i].AppTcId;
      this.appTC.TcCode = this.MainInfoForm.value.TCList[i].TcCode;
      this.appTC.TcName = this.MainInfoForm.value.TCList[i].TcName;
      this.appTC.PriorTo = this.MainInfoForm.value.TCList[i].PriorTo;
      this.appTC.IsChecked = this.MainInfoForm.getRawValue().TCList[i].IsChecked;
      this.appTC.IsWaived = this.MainInfoForm.getRawValue().TCList[i].IsWaived;
      this.appTC.ExpiredDt = this.MainInfoForm.getRawValue().TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.MainInfoForm.value.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.MainInfoForm.getRawValue().TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.MainInfoForm.value.TCList[i].CheckedDt;
      this.appTC.Notes = this.MainInfoForm.value.TCList[i].Notes;
      this.appTC.RowVersion = this.MainInfoForm.value.TCList[i].RowVersion;

      let prmsDt = new Date(this.appTC.PromisedDt);
      let prmsDtForm = this.MainInfoForm.value.TCList[i].PromisedDt;

      if (this.appTC.IsChecked == false) {
        if (prmsDtForm != null) {
          if (prmsDt < businessDt) {
            this.toastr.warningMessage('Promise Date for ' + this.appTC.TcName + ' can\'t be lower than Business Date');
            return;
          }
        }
      }
      ListAppTcObj.push(this.appTC);
    }
    this.ListAppTCObj['ListAppTcObj'] = ListAppTcObj;

    const reqObj = {
      AppId: this.AppId,
      ListAppTcObj: ListAppTcObj
    }
    this.http.post(URLConstantX.EditAppTcX, reqObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_PGL_REQ_APPRVL], {
          'AgrmntId': this.AgrmntId,
          'AppId': this.AppId,
          'AgrmntNo': this.AgrmntNo,
          'TaskListId': this.TaskListId
        });
        this.toastr.successMessage(response['message']);

      });

  }

  SaveForm(flag = true) {
    const effDate = new Date(this.MainInfoForm.controls.EffectiveDt.value);

    if (effDate.getTime() > this.MaxEffDt.getTime()) {
      this.toastr.warningMessage('Maturity Date must be lower than MOU Expired Date');
      return;
    }

    let businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));

    this.listAppTCObj = new ListAppTCObj();
    this.listAppTCObj.AppTCObj = [];

    if (this.BizTemplateCode != CommonConstant.DF) {
      for (let i = 0; i < this.MainInfoForm.value.TCList["length"]; i++) {
        this.appTC = new AppTCObj();
        this.appTC.AppId = this.MainInfoForm.value.TCList[i].AppId;
        this.appTC.AppTcId = this.MainInfoForm.value.TCList[i].AppTcId;
        this.appTC.TcCode = this.MainInfoForm.value.TCList[i].TcCode;
        this.appTC.TcName = this.MainInfoForm.value.TCList[i].TcName;
        this.appTC.PriorTo = this.MainInfoForm.value.TCList[i].PriorTo;
        this.appTC.IsChecked = this.MainInfoForm.getRawValue().TCList[i].IsChecked;
        this.appTC.IsWaived = this.MainInfoForm.getRawValue().TCList[i].IsWaived;
        this.appTC.ExpiredDt = this.MainInfoForm.getRawValue().TCList[i].ExpiredDt;
        this.appTC.IsMandatory = this.MainInfoForm.value.TCList[i].IsMandatory;
        this.appTC.PromisedDt = this.MainInfoForm.getRawValue().TCList[i].PromisedDt;
        this.appTC.CheckedDt = this.MainInfoForm.value.TCList[i].CheckedDt;
        this.appTC.Notes = this.MainInfoForm.value.TCList[i].Notes;
        this.appTC.RowVersion = this.MainInfoForm.value.TCList[i].RowVersion;

        let prmsDt = new Date(this.appTC.PromisedDt);
        let prmsDtForm = this.MainInfoForm.value.TCList[i].PromisedDt;

        if (this.appTC.IsChecked == false) {
          if (prmsDtForm != null) {
            if (prmsDt < businessDt) {
              this.toastr.warningMessage('Promise Date for ' + this.appTC.TcName + ' can\'t be lower than Business Date');
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
    if (this.IsNeedApv) {
      this.PreGoLiveObj.IsNeedApv = true;
      this.PreGoLiveObj.FlagResume = flag;
      this.PreGoLiveObj.RequestRFAGoLiveObj = {RFAInfo: this.GoLiveApvForm.controls.RFAInfo.value};
      if (this.isNeedEndDateApv) {
        this.PreGoLiveObj.RequestRFAEndDateObj = {RFAInfo: this.MainInfoForm.controls.RFAInfo.value};
        this.PreGoLiveObj.IsNeedEndDateApv = true;
      }
    }

    console.log(this.PreGoLiveObj);
    this.http.post(URLConstantX.AddPreGoLiveX, this.PreGoLiveObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [this.CancelLink], {});
        this.toastr.successMessage(response['message']);

      });

  }

  async getAddInterestPaidBy() {
    await this.http.post(URLConstant.GetGeneralSettingByCode, {Code: CommonConstant.GsDiffdaysglveff}).toPromise().then(
      (response) => {
        if (response['GsValue']) {
          this.IsGSAddInerestExists = true;
        }
      }
    );
    if (!this.IsGSAddInerestExists) {
      return;
    }


    this.MainInfoForm.controls['AdditionalInterestPaidBy'].setValidators([Validators.required]);
    this.MainInfoForm.controls['AdditionalInterestPaidBy'].updateValueAndValidity();
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAdditionalInterestPaidBy}).toPromise().then(
      (response) => {
        this.ListRmAddInterestPaidByCode = response[CommonConstant.ReturnObj];
        if (this.BizTemplateCode === CommonConstant.CFNA) {
          this.MainInfoForm.patchValue({
            AdditionalInterestPaidBy: CommonConstantX.AdditionalInterestPaidByCustomer
          });
          this.MainInfoForm.controls['AdditionalInterestPaidBy'].disable();
        }
      }
    );
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

  calculateAddInterest() {
    let diffDays = 0;
    let diffTimes = new Date(this.MainInfoForm.controls.GoLiveEstimated.value).getTime() - new Date(this.MainInfoForm.controls.EffectiveDt.value).getTime();
    if (diffTimes > 0) {
      diffDays = diffTimes / (1000 * 3600 * 24)
      console.log(diffDays);

      this.http.post(URLConstantX.CalculateAdditionalInterestX, {AgrmntId: this.AgrmntId, DiffDays: diffDays}).subscribe(
        (response) => {
          this.MainInfoForm.patchValue({
            AddIntrstAmt: response['Result']
          });
        }
      );
    } else {
      this.MainInfoForm.patchValue({
        AddIntrstAmt: 0
      });
    }
  }

  //JD-LMS-001
  InputEndDateProdObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  InputGoLiveObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  IsReady: boolean;
  itemReasonEndDate: Array<KeyValueObj>;
  itemReasonGoLive: Array<KeyValueObj>;
  isOk: boolean = true;
  isNeedEndDateApv: boolean = false;

  async initInputApprovalObj() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let obj = {
      ProdOfferingCode: this.AgrmntResult.ProdOfferingCode,
      RefProdCompntCode: '',
      ProdOfferingVersion: this.AgrmntResult.ProdOfferingVersion
    };
    if (this.BizTemplateCode != CommonConstant.DF) {
      obj.RefProdCompntCode = 'END_DATE_GO_LIVE_APV';

      await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).toPromise().then(
        (response) => {
          if (response && response['StatusCode'] == '200') {
            let LastDt = new Date(formatDate(response['CompntValue'], 'yyyy-MM-dd', 'en-US'));
            let NowDt = new Date(formatDate(currentUserContext.BusinessDt, 'yyyy-MM-dd', 'en-US'));
            if (NowDt <= LastDt) {
              this.isNeedEndDateApv = false;
            } else {
              let AttributesEndDateEmpty = [{}]
              let TypeEndDateCode = {
                'TypeCode': 'END_DATE_GO_LIVE_APV_TYPE',
                'Attributes': AttributesEndDateEmpty,
              };

              this.InputEndDateProdObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
              this.InputEndDateProdObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
              this.InputEndDateProdObj.ApvTypecodes = [TypeEndDateCode];
              this.InputEndDateProdObj.CategoryCode = 'END_DATE_GO_LIVE_APV';
              this.InputEndDateProdObj.SchemeCode = 'END_DATE_GO_LIVE_APV_SCHM';
              this.InputEndDateProdObj.TrxNo = this.AgrmntNo;
              this.InputEndDateProdObj.Reason = this.itemReasonEndDate;

              this.isNeedEndDateApv = true;

            }
          } else {
            this.toastr.warningMessage('No Setting for Prod Offering Component END_DATE_GO_LIVE_APV');
            this.isOk = false;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }


    obj.RefProdCompntCode = 'GO_LIVE_APV';

    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).toPromise().then(
      (response) => {
        if (response && response['StatusCode'] == '200') {
          let AttributesGoLive = [{}]
          let TypeEnGoLiveDate = {
            'TypeCode': 'GO_LIVE_APV_TYPE',
            'Attributes': AttributesGoLive,
          };
          this.InputGoLiveObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
          this.InputGoLiveObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
          this.InputGoLiveObj.ApvTypecodes = [TypeEnGoLiveDate];
          this.InputGoLiveObj.CategoryCode = 'GO_LIVE_APV';
          this.InputGoLiveObj.SchemeCode = response['CompntValue'];
          this.InputGoLiveObj.Reason = this.itemReasonGoLive;
          this.InputGoLiveObj.TrxNo = this.AgrmntNo
        } else {
          this.toastr.warningMessage('No Setting for Prod Offering Component GO_LIVE_APV');
          this.isOk = false;
        }
      },
      (error) => {
        console.log(error);
      }
    );

    this.IsReady = true;
  }

  async LoadRefReason() {
    let refReasonObj: ReqGetByTypeCodeObj = {
      RefReasonTypeCode: 'END_DATE_GO_LIVE_APV'
    }
    await this.http.post(URLConstant.GetListActiveRefReason, refReasonObj).toPromise().then(
      (response) => {
        this.itemReasonEndDate = response[CommonConstant.ReturnObj];
      }
    );
    refReasonObj.RefReasonTypeCode = 'GO_LIVE_APV'

    await this.http.post(URLConstant.GetListActiveRefReason, refReasonObj).toPromise().then(
      (response) => {
        this.itemReasonGoLive = response[CommonConstant.ReturnObj];
      }
    );
  }

  consoleLog() {
    console.log(this.MainInfoForm);
  }
}
