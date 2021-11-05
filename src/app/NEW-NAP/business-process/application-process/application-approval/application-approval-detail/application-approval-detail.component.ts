import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/app/app.model';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { CrdRvwCustInfoObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-obj.model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
import { environment } from 'environments/environment';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';

@Component({
  selector: 'app-application-approval-detail',
  templateUrl: './application-approval-detail.component.html',
})
export class ApplicationApprovalDetailComponent implements OnInit {
  appId: number = 0;
  ApvReqId: number = 0;
  mrCustTypeCode: string;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  type: string;
  ManualDeviationData;
  isExistedManualDeviationData;
  BizTemplateCode: string;
  AppObj: AppObj = new AppObj();
  taskId: number = 0;
  CrdApvObj: UcInputApprovalHistoryObj;
  readonly CustTypePersonal: string = CommonConstant.CustTypePersonal;
  readonly CustTypeCompany: string = CommonConstant.CustTypeCompany;
  readonly PefindoLink: string = NavigationConstant.PEFINDO_VIEW;
  IsCrdApvReady: boolean = false;
  
  constructor(private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
      }
      if (params["MrCustTypeCode"] != null) {
        this.mrCustTypeCode = params["MrCustTypeCode"];
      }
      if (params["ApvReqId"] != null) {
        this.ApvReqId = params["ApvReqId"];
      }
      
      var ApvHoldObj = new ApprovalObj()
      ApvHoldObj.TaskId = params["TaskId"];

      this.HoldTask(ApvHoldObj);
      this.taskId = params["TaskId"];
    });
  }
  
  async ngOnInit(): Promise<void> {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppOPLMainInformation.json";
    this.CrdApvObj = new UcInputApprovalHistoryObj();
    this.CrdApvObj.PathUrl = "/Approval/GetTaskHistory";
    await this.getApp();
    await this.GetCrdRvwCustInfoByAppId();
    this.initInputApprovalObj();
  }

  getCrdHist(AppNo) {
    this.http.post(URLConstant.GetRfaLogByTrxNo, { TrxNo: AppNo }).subscribe(
      (response) => {
        for (let i = 0; i < response['ListRfaLogObj'].length; i++) {

          if (response['ListRfaLogObj'][i]['ApvCategory'] == CommonConstant.ApvCategoryApplicaitonApproval) {
            this.CrdApvObj.RequestId = response['ListRfaLogObj'][i]['RfaNo'];
          }
        }
        this.IsCrdApvReady = true;
      },
      (error) => {
        this.IsCrdApvReady = true;
      }
    );
  }

  crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  isShow: boolean = false;
  captureStat: string = "";
  async GetCrdRvwCustInfoByAppId() {
    await this.http.post<CrdRvwCustInfoObj>(URLConstant.GetCrdRvwCustInfoByAppId, { Id: this.appId }).toPromise().then(
      (response) => {
        this.crdRvwCustInfoObj = response;
        this.isShow = true;
      }
    );

    let refMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCaptureStat,
      MasterCode: this.crdRvwCustInfoObj.CaptureStat
    };
    await this.http.post<KeyValueObj>(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
      (response) => {
        this.captureStat = response.Value;
      }
    );
  }

  HoldTask(obj: ApprovalObj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => { },
      (error) => {
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_APP_PRCS_CRD_APPRV_PAGING], { "BizTemplateCode": this.BizTemplateCode });
      }
    )
  }

  InputApvObj : UcInputApprovalObj;
  InputApprovalHistoryObj : UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  initInputApprovalObj() {
    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;
    
    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
    this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.TrxNo =  this.AppObj.AppNo;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.IsReady = true;
  }

  //#region Uc Approval 
  async getApp() {
    // let appObj = new AppObj();
    // appObj.AppId = this.appId
    var appObj = { Id: this.appId };
    await this.http.post<AppObj>(URLConstant.GetAppById, appObj).toPromise().then((response) => {
      this.AppObj = response;
      this.getCrdHist(this.AppObj.AppNo);
    });
  }

  onApprovalSubmited(event) {
    let ReqApvCustomObj = {
      AppId: this.appId,
      Tasks: event.Tasks
    }

    this.http.post(URLConstant.Approval, ReqApvCustomObj).subscribe((response) => {
      this.toastr.successMessage(response["Message"]);
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_APP_PRCS_CRD_APPRV_PAGING], { "BizTemplateCode": this.BizTemplateCode });
    });
  }

  // onAvailableNextTask() { }
  
  onCancelClick() {    
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_APP_PRCS_CRD_APPRV_PAGING], { "BizTemplateCode": this.BizTemplateCode });
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }
  
  OpenPefindoView(){
    window.open(environment.losR3Web + NavigationConstant.PEFINDO_VIEW + "?AppId=" + this.appId, "_blank");
  }
  //#endregion
}