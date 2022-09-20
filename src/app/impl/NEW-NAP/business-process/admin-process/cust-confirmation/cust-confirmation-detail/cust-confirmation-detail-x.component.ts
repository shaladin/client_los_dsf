import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppObj } from 'app/shared/model/App/App.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { environment } from 'environments/environment';
import { Validators, FormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { VerfResultHObj } from 'app/shared/model/verf-result-h/verf-result-h.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { VerfResultObj } from 'app/shared/model/verf-result/verf-result.model';
import { CustCnfrmObj } from 'app/shared/model/cust-cnfrm/cust-cnfrm.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { ResAppCustForListCustMainDataObj, ResListCustMainDataObj } from 'app/shared/model/response/nap/cust-main-data/res-list-cust-main-data-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { AgrmntObj } from 'app/shared/model/agrmnt/agrmnt.model';

@Component({
  selector: 'app-cust-confirmation-detail-x',
  templateUrl: './cust-confirmation-detail-x.component.html'
})
export class CustConfirmationDetailXComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  arrValue = [];
  AgrmntId: number;
  AppId: number;
  TaskListId: any;
  AgrmntNo: string;
  VerfResultList = new Array<VerfResultHObj>();
  CustNoObj: GenericObj = new GenericObj();
  IsSkip: boolean = false;
  appObj: AppObj = new AppObj();
  verfResultObj: VerfResultObj = new VerfResultObj();
  CustCnfrmObj: CustCnfrmObj = new CustCnfrmObj();
  BizTemplateCode: string;
  CustConfirmForm = this.fb.group({
    AgrmntCreatedDt: [''],
    EffectiveDt: [''],
    AddIntrstAmt:[0],
    GoLiveEstimated: [''],
    AdditionalInterestPaidBy: ['']
  });
  UserAccess: CurrentUserContext;
  businessDt: Date = new Date();
  checkPOReady: boolean = false;
  PODt: Date = new Date();
  isHasPO: boolean = false;

  readonly ViewLink: string = NavigationConstant.NAP_ADM_PRCS_CUST_CONFIRM_SUBJ_VIEW;
  readonly DetailLink: string = NavigationConstant.NAP_ADM_PRCS_CUST_CONFIRM_SUBJ_DETAIL;
  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_CUST_CONFIRM_PAGING;
  constructor(private route: ActivatedRoute, private http: HttpClient,
    private router: Router, private toastr: NGXToastrService, private cookieService: CookieService,
    private claimTaskService: ClaimTaskService, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AgrmntNo"] != null) {
        this.AgrmntNo = params["AgrmntNo"];
      }
      if (params["TaskListId"] != null) {
        this.TaskListId = params["TaskListId"];
      }
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  async ngOnInit() {
    this.claimTask();
    this.arrValue.push(this.AgrmntId);
    if (this.BizTemplateCode == CommonConstant.CFNA) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCustConfirmInfoCFNA.json";
      this.viewGenericObj.whereValue = this.arrValue;
      this.CustConfirmForm.controls.AgrmntCreatedDt.setValidators(Validators.required);
      this.CustConfirmForm.controls.EffectiveDt.setValidators(Validators.required);
      this.CustConfirmForm.controls.GoLiveEstimated.setValidators(Validators.required);
      this.CustConfirmForm.controls.AgrmntCreatedDt.updateValueAndValidity();
      this.CustConfirmForm.controls.EffectiveDt.updateValueAndValidity();
      this.CustConfirmForm.controls.GoLiveEstimated.updateValueAndValidity();

      this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.businessDt = this.UserAccess.BusinessDt;
      this.CustConfirmForm.patchValue({
        GoLiveEstimated: formatDate(this.UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US'),
      });

      this.http.post(URLConstant.GetPurchaseOrderHByAgrmntId, {Id: this.AgrmntId}).subscribe(
        (response) => {
          if(response["PurchaseOrderHId"] != 0){
            this.PODt = response["PurchaseOrderDt"];
            this.isHasPO = true;
          }
          this.checkPOReady = true;
        }
      );
      this.getLocalStorageData();
    } else {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCustConfirmInfo.json";
    }
    this.http.post(URLConstant.GetAgrmntByAgrmntId, { Id: this.AgrmntId }).subscribe(
      (response: AgrmntObj) => {
        this.CustConfirmForm.patchValue({
          AgrmntCreatedDt: formatDate(response.AgrmntCreatedDt, 'yyyy-MM-dd', 'en-US'),
        })
        if (response["EffectiveDt"] != null) {
          this.CustConfirmForm.patchValue({
            EffectiveDt: formatDate(response.EffectiveDt, 'yyyy-MM-dd', 'en-US'),
          })
        }
        if (response["GoLiveDt"] != null) {
          this.CustConfirmForm.patchValue({
            GoLiveEstimated: formatDate(response.GoLiveDt, 'yyyy-MM-dd', 'en-US'),
          })
        }
      }
    );

    this.http.post(URLConstantX.GetAgrmntOtherInfoByAgrmntIdX, { Id: this.AgrmntId }).subscribe(
      (response) => {
        this.CustConfirmForm.patchValue({
          AdditionalInterestPaidBy: response["AdditionalInterestPaidBy"]
        })
      }
    );


    await this.GetVerfResult();
    await this.getAddInterestPaidBy();
  }

  async GetVerfResult(IsAdded: boolean = false) {
    await this.http.post(URLConstant.GetVerfResultHsByTrxRefNo, { TrxNo: this.AgrmntNo }).toPromise().then(
      async (response) => {
        this.VerfResultList = response["responseVerfResultHCustomObjs"];
        this.CustCnfrmObj.Phone = "-";
        this.CustCnfrmObj.MrCustCnfrmResultCode = "-";
        this.CustCnfrmObj.CnfmrNotes = "-";
        if (this.VerfResultList.length != 0) {
          this.CustCnfrmObj.Phone = this.VerfResultList[0].Phn;
          this.CustCnfrmObj.MrCustCnfrmResultCode = this.VerfResultList[0].MrVerfResultHStatCode;
          this.CustCnfrmObj.CnfmrNotes = this.VerfResultList[0].Notes;
        }
        this.CustCnfrmObj.AppId = this.AppId;
        this.CustCnfrmObj.AgrmntId = this.AgrmntId;
        if (this.VerfResultList.length == 0) {
          if (!IsAdded) {
            await this.AddNewVerfResult();
          }
        }
      });
  }

  async AddNewVerfResult() {
    var AppObj = {
      Id: this.AppId
    }
    await this.http.post<AppObj>(URLConstant.GetAppById, AppObj).toPromise().then(
      async (response) => {
        this.appObj = response;

        let flag = await this.GetListAppCustFamilyMainDataByAppId();

        let ListSubj: Array<string> = [];

        ListSubj.push(CommonConstant.RoleCustData);
        if (flag) ListSubj.push(CommonConstant.RoleFamilyData);

        this.verfResultObj.TrxRefNo = this.AgrmntNo;
        this.verfResultObj.EmpNo = "-";
        this.verfResultObj.MrVerfResultStatCode = CommonConstant.VerificationNew;
        this.verfResultObj.MrVerfTrxTypeCode = CommonConstant.VerfTrxTypeCodeCustConfirm;
        this.verfResultObj.LobCode = this.appObj.LobCode;
        this.verfResultObj.LobName = this.appObj.LobCode;
        this.verfResultObj.Notes = "-";
        this.verfResultObj.ListSubject = ListSubj;
        // console.log(this.verfResultObj);
        await this.http.post(URLConstant.AddVerfResultAndVerfResultH, this.verfResultObj).toPromise().then(
          async () => {
            await this.GetVerfResult(true);
          }
        );
      });
  }

  ListAppCustFamily: Array<ResAppCustForListCustMainDataObj> = new Array<ResAppCustForListCustMainDataObj>();
  async GetListAppCustFamilyMainDataByAppId() {
    let flag: boolean = false;
    await this.http.post(URLConstant.GetListAppCustMainDataByAppId, { AppId: this.AppId, IsFamily: true }).toPromise().then(
      (response : ResListCustMainDataObj) => {
        this.ListAppCustFamily = response.ListAppCustObj;
        if (this.ListAppCustFamily.findIndex(x => x.MrCustRelationshipCode == CommonConstant.RoleFamilyData) > -1) flag = true;
      }
    );

    return flag;
  }

  SaveForm() {
    if (this.CustCnfrmObj.IsSkip == false) {
      for (var i = 0; i < this.VerfResultList.length; i++) {
        if (this.VerfResultList[i].MrVerfResultHStatCode == CommonConstant.VerificationFail || this.VerfResultList[i].MrVerfResultHStatCode == CommonConstant.VerificationNew) {
          this.toastr.warningMessage(ExceptionConstant.RESULT_CANNOT_NEW_OR_FAILED);
          return;
        }
      }
      if(this.BizTemplateCode == CommonConstant.CFNA){
        var CustCnfrmWFCFNAObj = {
          RequestCustCnfrmObj: this.CustCnfrmObj,
          wfTaskListId: this.TaskListId,
          AgrmntCreatedDt: this.CustConfirmForm.controls.AgrmntCreatedDt.value,
          EffectiveDt: this.CustConfirmForm.controls.EffectiveDt.value,
          AdditionalInterestPaidBy: this.CustConfirmForm.controls.AdditionalInterestPaidBy.value,
          GoLiveDt : this.CustConfirmForm.controls.GoLiveEstimated.value,
        };
        this.http.post(URLConstantX.AddCustCnfrmX, CustCnfrmWFCFNAObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.clickCancel();
          });
      }
      else{
        var CustCnfrmWFObj = {
          RequestCustCnfrmObj: this.CustCnfrmObj,
          wfTaskListId: this.TaskListId
        };
        this.http.post(URLConstant.AddCustCnfrm, CustCnfrmWFObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.clickCancel();
          });
      }
    }
    else if (this.CustCnfrmObj.IsSkip == true) {
      if(this.BizTemplateCode == CommonConstant.CFNA){
        var CustCnfrmWFCFNAObj = {
          RequestCustCnfrmObj: this.CustCnfrmObj,
          wfTaskListId: this.TaskListId,
          AgrmntCreatedDt: this.CustConfirmForm.controls.AgrmntCreatedDt.value,
          EffectiveDt: this.CustConfirmForm.controls.EffectiveDt.value,
          AdditionalInterestPaidBy: this.CustConfirmForm.controls.AdditionalInterestPaidBy.value,
          GoLiveDt : this.CustConfirmForm.controls.GoLiveEstimated.value,
        };
        this.http.post(URLConstantX.AddCustCnfrmX, CustCnfrmWFCFNAObj).subscribe(
          () => {
            this.toastr.successMessage("Success !");
            this.clickCancel();
          });
      }
      else{
        var CustCnfrmWFObj = {
          RequestCustCnfrmObj: this.CustCnfrmObj,
          wfTaskListId: this.TaskListId
        };
        this.http.post(URLConstant.AddCustCnfrm, CustCnfrmWFObj).subscribe(
          () => {
            this.toastr.successMessage("Success !");
            this.clickCancel();
          });
      }

    }
  }

  GetCallBack(event) {
    if (event.Key == "customer") {
      this.CustNoObj.CustNo = event.ViewObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }
  }

  calculateAddInterest(){
    let diffDays = 0;
    const diffTimes = new Date(this.CustConfirmForm.controls.EffectiveDt.value).getTime() - new Date(this.CustConfirmForm.controls.GoLiveEstimated.value).getTime();
    if(diffTimes>0){
      diffDays = diffTimes / (1000*3600*24)
      console.log(diffDays);

      this.http.post(URLConstantX.CalculateAdditionalInterestX, { AgrmntId: this.AgrmntId, DiffDays: diffDays }).subscribe(
        (response) => {
          this.CustConfirmForm.patchValue({
            AddIntrstAmt: response["Result"]
          });
        }
      );
    }
    else{
      this.CustConfirmForm.patchValue({
        AddIntrstAmt: 0
      });
    }
  }

  claimTask(){
    if (environment.isCore){
      if (this.TaskListId != "" && this.TaskListId != undefined){
        this.claimTaskService.ClaimTaskV2(this.TaskListId);
      }
    }
    else if (this.TaskListId > 0) {
      this.claimTaskService.ClaimTask(this.TaskListId);
    }
  }

  getLocalStorageData() {
    var AgrmntCreatedDt = localStorage.getItem("AgrmntCreatedDt");
    var EffectiveDt = localStorage.getItem("EffectiveDt");
    var GoLiveEstimated = localStorage.getItem("GoLiveEstimated");

    if (AgrmntCreatedDt != null && AgrmntCreatedDt != "") {
      this.CustConfirmForm.patchValue({
        AgrmntCreatedDt: formatDate(AgrmntCreatedDt, 'yyyy-MM-dd', 'en-US'),
      });
    }

    if (EffectiveDt != null && EffectiveDt != "") {
      this.CustConfirmForm.patchValue({
        EffectiveDt: formatDate(EffectiveDt, 'yyyy-MM-dd', 'en-US'),
      });
    }

    if (GoLiveEstimated != null && GoLiveEstimated != "") {
      this.CustConfirmForm.patchValue({
        GoLiveEstimated: formatDate(GoLiveEstimated, 'yyyy-MM-dd', 'en-US'),
      });
    }
    this.calculateAddInterest();
  }

  saveToLocalStorage() {
    localStorage.setItem("AgrmntCreatedDt", this.CustConfirmForm.controls.AgrmntCreatedDt.value);
    localStorage.setItem("EffectiveDt", this.CustConfirmForm.controls.EffectiveDt.value);
    localStorage.setItem("GoLiveEstimated", this.CustConfirmForm.controls.GoLiveEstimated.value);
  }

  removeFromLocalStorage() {
    localStorage.removeItem("AgrmntCreatedDt");
    localStorage.removeItem("EffectiveDt");
    localStorage.removeItem("GoLiveEstimated");
  }

  clickView(VerfResultHId) {
    this.saveToLocalStorage();
    AdInsHelper.RedirectUrl(this.router,[this.ViewLink], { "VerfResultHId": VerfResultHId, "AgrmntId": this.AgrmntId, "AppId": this.AppId, "AgrmntNo": this.AgrmntNo, "TaskListId": this.TaskListId, "BizTemplateCode": this.BizTemplateCode });
  }

  clickEdit(VerfResultHId, MrVerfSubjectRelationCode) {
    this.saveToLocalStorage();
    AdInsHelper.RedirectUrl(this.router,[this.DetailLink], { "VerfResultHId": VerfResultHId, "AgrmntId": this.AgrmntId, "AppId": this.AppId, "Subject": MrVerfSubjectRelationCode,"AgrmntNo": this.AgrmntNo, "TaskListId": this.TaskListId, "BizTemplateCode": this.BizTemplateCode });
  }

  clickCancel() {
    this.removeFromLocalStorage();
    AdInsHelper.RedirectUrl(this.router,[this.CancelLink], { "BizTemplateCode": this.BizTemplateCode });
  }

  ListRmAddInterestPaidByCode: Array<KeyValueObj>;
  IsGSAddInerestExists: boolean = false;
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


    this.CustConfirmForm.controls['AdditionalInterestPaidBy'].setValidators([Validators.required]);
    this.CustConfirmForm.controls['AdditionalInterestPaidBy'].updateValueAndValidity();
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAdditionalInterestPaidBy }).toPromise().then(
      (response) => {
        this.ListRmAddInterestPaidByCode = response[CommonConstant.ReturnObj];
        if (this.BizTemplateCode === CommonConstant.CFNA) {
          this.ListRmAddInterestPaidByCode = this.ListRmAddInterestPaidByCode.filter(x => x.Key == CommonConstantX.AdditionalInterestPaidByCustomer || x.Key == CommonConstantX.REF_MASTER_CODE_NO_ADD_INTEREST)
        }
      }
    );
  }

  changeAddInterestPaidBy(){
    if(this.CustConfirmForm.controls.AdditionalInterestPaidBy.value == CommonConstantX.REF_MASTER_CODE_NO_ADD_INTEREST){
      this.CustConfirmForm.patchValue({
        GoLiveEstimated: this.CustConfirmForm.controls.EffectiveDt.value
      });
      this.CustConfirmForm.controls['GoLiveEstimated'].disable();
    }
    else{
      this.CustConfirmForm.controls['GoLiveEstimated'].enable();
    }
  }

  checkAddInterestPaidBy(){
    if(this.CustConfirmForm.controls.AdditionalInterestPaidBy.value == CommonConstantX.REF_MASTER_CODE_NO_ADD_INTEREST){
      this.CustConfirmForm.patchValue({
        GoLiveEstimated: this.CustConfirmForm.controls.EffectiveDt.value
      });
    }
  }
}
