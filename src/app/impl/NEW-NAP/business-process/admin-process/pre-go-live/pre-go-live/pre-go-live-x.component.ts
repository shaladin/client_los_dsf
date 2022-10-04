import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { PreGoLiveObjX } from 'app/impl/shared/model/PreGoLiveObjX.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { forkJoin } from 'rxjs';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { AppObj } from 'app/shared/model/App/App.Model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { AgrmntTcObj } from 'app/shared/model/agrmnt-tc/agrmnt-tc-obj.model';
import { PreGoLiveMainObj } from 'app/shared/model/pre-go-live-main-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { RfaObj } from 'app/shared/model/approval/rfa-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ReqGetRfaLogByTrxNoAndApvCategoryObj } from 'app/shared/model/request/nap/pre-go-live/req-get-rfa-log-by-trx-no-and-apv-category-obj.model';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { RefPayFreqObj } from 'app/shared/model/ref-pay-freq-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { ReqSubmitAgrmntTcObj } from 'app/shared/model/agrmnt-tc/req-submit-agrmnt-tc-obj.model';
import { UcInputRFAObj } from 'app/shared/model/uc-input-rfa-obj.model';
import { ResultAttrObj } from 'app/shared/model/type-result/result-attr-obj.model';
import { ReqGetByTypeCodeObj } from 'app/shared/model/ref-reason/req-get-by-type-code-obj.model';

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
  agrmntTcObj: AgrmntTcObj;
  TaskListId: any;
  PreGoLiveMainObj: PreGoLiveMainObj = new PreGoLiveMainObj();
  PreGoLiveObj: PreGoLiveObjX = new PreGoLiveObjX();
  AgrmntObj: AgrmntObj = new AgrmntObj();
  ReqByIdObj: GenericObj = new GenericObj();
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  ReturnName: string = "DO";
  IsCheckedAll: boolean = false;
  custType: string = CommonConstant.CustTypePersonal;
  isOktoBack: boolean = true;
  MainInfoForm = this.fb.group({
    AgrmntCreatedDt: [''], //DSF INTERNAL-0229 Udin : Lepas validasi AgrmntDt mandatory
    EffectiveDt: ['', Validators.required],
    Notes: ['', Validators.required],
    ApprovalStatus: [''],
    AdditionalInterestPaidBy: [''],
    AddIntrstAmt: [0],
    GoLiveEstimated: [''],
    AdditionalInterestPaidByName: [''],
  })
  listAgrmntTcObj: Array<AgrmntTcObj>;

  GoLiveApvForm = this.fb.group({})
  PreGoLiveApvForm = this.fb.group({})

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
  ApvAmt: number = 0;
  DiffDay: number = 0;
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
    if (this.BizTemplateCode == CommonConstant.CFNA) {
      this.ReturnName = "Cust Confirm"
    }
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
          GoLiveEstimated: formatDate(this.AgrmntResult.GoLiveDt, 'yyyy-MM-dd', 'en-US'),
        })
        if (this.AgrmntResult.EffectiveDt == null) {
          this.MainInfoForm.patchValue({
            EffectiveDt: formatDate(this.businessDt, 'yyyy-MM-dd', 'en-US'),
          })
        } else {
          this.MainInfoForm.patchValue({
            EffectiveDt: formatDate(this.AgrmntResult.EffectiveDt, 'yyyy-MM-dd', 'en-US'),
          })
        }
        this.AgrmntId = this.AgrmntResult.AgrmntId;
        this.AppId = this.AgrmntResult.AppId;
        this.calculateAddInterest();
      });

    const agrObj = { Id: this.AgrmntId };
    const appObj = { Id: this.AppId };
    const sysConfigCodeObj = { Code: CommonConstant.ConfigCodeIsUseDms };

    const getAgr = this.http.post(URLConstant.GetAgrmntByAgrmntId, agrObj)
    const getAppCust = this.http.post(URLConstant.GetAppCustByAppId, appObj)
    const getApp = this.http.post<AppObj>(URLConstant.GetAppById, appObj)
    const getSysConfigResult = this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, sysConfigCodeObj);
    await forkJoin([getAgr, getAppCust, getApp, getSysConfigResult]).toPromise().then(
      (response) => {
        this.agrNo = response[0]['AgrmntNo'];
        this.custNo = response[1]['CustNo'];
        this.custType = response[1]['MrCustTypeCode'];
        this.AppObj = response[2];
        this.SysConfigResultObj = response[3];

        this.appNo = this.AppObj.AppNo;
        const mouId = this.AppObj.MouCustId;
        if (this.BizTemplateCode == CommonConstant.DF) {
          this.http.post(URLConstant.GetMouCustById, { Id: mouId }).subscribe(
            async (result: MouCustObj) => {
              this.mouCustNo = result.MouCustNo;
              const endDt = new Date(result.EndDt);
              this.MaxEffDt = new Date(result.EndDt);
              let Tenor = this.AgrmntResult.Tenor;
              if (this.AppObj.MrFirstInstTypeCode == CommonConstant.FirstInstTypeAdvance) {
                await this.http.post<RefPayFreqObj>(URLConstant.GetRefPayFreqByPayFreqCode, { Code: this.AppObj.PayFreqCode }).toPromise().then(
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
        }else if (this.BizTemplateCode == CommonConstant.CFNA && this.custType == CommonConstant.CustTypeCompany) {
          this.isOktoBack = false;
        }
      }
    );
    this.http.post(URLConstantX.GetAgrmntOtherInfoByAgrmntIdX, { Id: this.AgrmntId }).subscribe(
      (response) => {
        this.MainInfoForm.patchValue({
          AdditionalInterestPaidBy: response["AdditionalInterestPaidBy"],
          AdditionalInterestPaidByName: response["AdditionalInterestPaidByName"],
        })
      }
    );

    await this.getPODate();
    //await this.getAddInterestPaidBy();
    await this.InitDms();
    await this.LoadRefReason();
    if (this.BizTemplateCode == CommonConstant.CF4W || this.BizTemplateCode == CommonConstant.FL4W || this.BizTemplateCode == CommonConstant.CFNA || this.BizTemplateCode == CommonConstant.DF) {
      this.IsNeedApv = true;
      await this.BindAppvAmt();
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
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeAgr;

      if (this.custNo != '') {
        this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
      }
      this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
      this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoAgr, this.agrNo));

      this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadDownloadView));

      if (this.AppObj.MouCustId == 0) {
        this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.mouCustNo));
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

  }

  SaveForm(flag = true) {
    if (this.BizTemplateCode == CommonConstant.DF) {
      const effDate = new Date(this.MainInfoForm.controls.EffectiveDt.value);
      if (effDate.getTime() > this.MaxEffDt.getTime()) {
        this.toastr.warningMessage('Maturity Date must be lower than MOU Expired Date');
        return;
      }
    }

    let businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));


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
    if (this.IsNeedApv) {
      this.PreGoLiveObj.FlagResume = flag;
      this.PreGoLiveObj.RequestRFAGoLiveObj = { RFAInfo: this.GoLiveApvForm.controls.RFAInfo.value };
      if (this.isNeedEndDateApv) {
        this.PreGoLiveObj.RequestRFAEndDateObj = { RFAInfo: this.MainInfoForm.controls.RFAInfo.value };
        this.PreGoLiveObj.IsNeedEndDateApv = true;
      }
      if(!this.IsCheckedAll) {
        this.PreGoLiveObj.RequestRFAPreGoLiveObj = { RFAInfo: this.PreGoLiveApvForm.controls.RFAInfo.value };
        this.PreGoLiveObj.IsNeedApv = true;
      }
    }

    console.log(this.PreGoLiveObj);

    var reqSubmitAgrmntTcObj = new ReqSubmitAgrmntTcObj();
    reqSubmitAgrmntTcObj.AgrmntId = this.AgrmntId;
    reqSubmitAgrmntTcObj.ListAgrmntTcObj = this.listAgrmntTcObj;

    this.http.post(URLConstant.SubmitAgrmntTc, reqSubmitAgrmntTcObj).subscribe(
      (response) => {
        this.toastr.successMessage(response['message']);

      });

    let AddPreGoLiveXUrl = environment.isCore ? URLConstantX.AddPreGoLiveXV3 : URLConstantX.AddPreGoLiveX;

    this.http.post(AddPreGoLiveXUrl, this.PreGoLiveObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router, [this.CancelLink], { BizTemplateCode: this.BizTemplateCode });
        this.toastr.successMessage(response['message']);

      });

  }

  async getAddInterestPaidBy() {
    await this.http.post(URLConstant.GetGeneralSettingByCode, { Code: CommonConstant.GsDiffdaysglveff }).toPromise().then(
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
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAdditionalInterestPaidBy }).toPromise().then(
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

  claimTask() {
    if (environment.isCore) {
      if (this.TaskListId != "" && this.TaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.TaskListId);
      }
    }
    else if (this.TaskListId > 0) {
      this.claimTaskService.ClaimTask(this.TaskListId);
    }
  }

  calculateAddInterest() {
    let diffDays = 0;
    const diffTimes = new Date(this.MainInfoForm.controls.EffectiveDt.value).getTime() - new Date(this.MainInfoForm.controls.GoLiveEstimated.value).getTime();
    if (diffTimes > 0) {
      diffDays = diffTimes / (1000 * 3600 * 24)
      console.log(diffDays);

      this.http.post(URLConstantX.CalculateAdditionalInterestX, { AgrmntId: this.AgrmntId, DiffDays: diffDays }).subscribe(
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
  InputPreGoLiveObj: UcInputRFAObj = new UcInputRFAObj(this.cookieService);
  IsReady: boolean;
  itemReasonEndDate: Array<KeyValueObj>;
  itemReasonGoLive: Array<KeyValueObj>;
  itemReasonPreGoLive: Array<KeyValueObj>;
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
      obj.RefProdCompntCode = 'END_DATE_GO_LIVE_APV_SCHM';
      let endGoliveSchm = "END_DATE_GO_LIVE_APV_SCHM";
      await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).toPromise().then(
        (response) => {
          if (response && response['StatusCode'] == '200') {
            endGoliveSchm = response['CompntValue'];
          } else {
            this.toastr.warningMessage('No Setting for Prod Offering Component END_DATE_GO_LIVE_APV_SCHM');
            this.isOk = false;
          }
        },
        (error) => {
          console.log(error);
        }
      );

      obj.RefProdCompntCode = 'END_DATE_GO_LIVE_APV';
      await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).toPromise().then(
        (response) => {
          if (response && response['StatusCode'] == '200') {
            let LastDt = new Date(formatDate(response['CompntValue'], 'yyyy-MM-dd', 'en-US'));
            let NowDt = new Date(formatDate(currentUserContext.BusinessDt, 'yyyy-MM-dd', 'en-US'));
            if (NowDt <= LastDt) {
              this.isNeedEndDateApv = false;
            } else {
              var diffTimes = NowDt.getTime() - LastDt.getTime();
              let Days = diffTimes / (1000 * 3600 * 24)
              if (Days > 0) {
                this.DiffDay = Days;
              }

              let AttributesEndDateEmpty: Array<ResultAttrObj> = new Array();
              var attribute1: ResultAttrObj = {
                AttributeName: "Approval Amount",
                AttributeValue: this.DiffDay.toString()
              };
              AttributesEndDateEmpty.push(attribute1);
              let TypeEndDateCode = {
                'TypeCode': 'END_DATE_GO_LIVE_APV_TYPE',
                'Attributes': AttributesEndDateEmpty,
              };

              this.InputEndDateProdObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
              this.InputEndDateProdObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
              this.InputEndDateProdObj.ApvTypecodes = [TypeEndDateCode];
              this.InputEndDateProdObj.CategoryCode = 'END_DATE_GO_LIVE_APV';
              this.InputEndDateProdObj.SchemeCode = endGoliveSchm;
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

          let Attributes = [
            {
              "AttributeName": "Approval Amount",
              "AttributeValue": this.ApvAmt
            }
          ];

          let TypeCode = {
            TypeCode: CommonConstantX.GO_LIVE_APV_TYPE_APV_TYPE,
            Attributes: Attributes,
          };

          this.InputGoLiveObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
          this.InputGoLiveObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
          this.InputGoLiveObj.ApvTypecodes = [TypeCode];
          this.InputGoLiveObj.CategoryCode = CommonConstantX.CAT_CODE_GO_LIVE_APV;
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

    obj.RefProdCompntCode = CommonConstant.ApvCategoryPreGoLive;

    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj).toPromise().then(
      (response) => {
        if (response && response['StatusCode'] == '200') {

          let Attributes: Array<ResultAttrObj> = new Array();
          let Attribute1: ResultAttrObj = {
            AttributeName: "Approval Amount",
            AttributeValue: this.ApvAmt.toString()
          };
          Attributes.push(Attribute1);
          let TypeCode = {
            "TypeCode": "PRE_GLV_APV_TYPE",
            "Attributes": Attributes,
          };
          let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
          this.InputPreGoLiveObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
          this.InputPreGoLiveObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
          this.InputPreGoLiveObj.ApvTypecodes = [TypeCode];
          this.InputPreGoLiveObj.CategoryCode = CommonConstant.CAT_CODE_PRE_GO_LIVE_APV;
          this.InputPreGoLiveObj.SchemeCode = response['CompntValue'];
          this.InputPreGoLiveObj.Reason = this.itemReasonPreGoLive;
          this.InputPreGoLiveObj.TrxNo = this.AgrmntNo;
        } else {
          this.toastr.warningMessage('No Setting for Prod Offering Component PRE_GPV_APV');
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
    refReasonObj.RefReasonTypeCode = CommonConstant.RefReasonTypeCodePreGlvApv

    await this.http.post(URLConstant.GetListActiveRefReason, refReasonObj).toPromise().then(
      (response) => {
        this.itemReasonPreGoLive = response[CommonConstant.ReturnObj];
      }
    );
  }

  consoleLog() {
    console.log(this.MainInfoForm);
  }

  async BindAppvAmt() {
    await this.http.post(URLConstantX.GetAgrmntFinDataNtfAmtByAgrmntId, { Id: this.AgrmntId }).toPromise().then(
      (response) => {
        this.ApvAmt = response["Result"];
      });
  }

  Return(){
    let message = "Are you sure you want to go back to "+this.ReturnName+"?";
    if(this.BizTemplateCode == CommonConstant.CF4W || this.BizTemplateCode == CommonConstant.FL4W){
      message = message+", It will delete all Insurance Order for this Agreement"
    }
    if (confirm(message)) {
      let obj = {
        AgrmntId : this.AgrmntId,
        TaskListId : this.TaskListId
      }
      let url = environment.isCore ? URLConstantX.BackToDeliveryOrderCustConfirmV2 : URLConstantX.BackToDeliveryOrderCustConfirm;
      this.http.post(url, obj).subscribe(
        (response) => {
          AdInsHelper.RedirectUrl(this.router, [this.CancelLink], { BizTemplateCode: this.BizTemplateCode });
          this.toastr.successMessage(response['message']);
        });
    }
  }
}
