import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { environment } from 'environments/environment';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { OutstandingTcObj } from 'app/shared/model/OutstandingTcObj.Model';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';

@Component({
  selector: 'app-pre-go-live-approval-detail',
  templateUrl: './pre-go-live-approval-detail.component.html'
})
export class PreGoLiveApprovalDetailComponent implements OnInit {
  inputObj: { taskId: any; instanceId: any; approvalBaseUrl: string; };
  viewObj: string;
  TrxNo: any;
  AgrmntNo: any;
  result: any;
  result2: any;
  result3: any;
  result4: any;
  result5: any;
  result6: any;
  arrValue = [];
  TCList: any;
  AppNo: any;
  NumOfAsset: any;
  Tenor: any;
  InstAmt: any;
  DeliveryDt: any;
  ProdOfferingName: any;
  WayOfFinancing: any;
  CustNo: any;
  CustName: any;
  OfficeName: any;
  PurposeOfFinancing: any;
  ProdOfferingCode: string;
  ProdOfferingVersion: string;
  LeadNo: string;
  MouNo: string;
  identifier: string = "TCList";
  IsApvReady: boolean = false;
  outstandingTcObj: any;
  listAppTCObj: ListAppTCObj;
  appTC: AppTCObj;
  count1: number = 0;
  ListRfaLogObj: any;
  listPreGoLiveAppvrObj: Array<any> = new Array<any>();

  MainInfoForm = this.fb.group({

  });
  AppId: any;
  AgrmntId: any;
  token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  LeadId: string;
  bizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  MouCustId: any;
  ApvReqId: number;
  taskId: number;
  InputApvObj: UcInputApprovalObj;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj: UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AgrmntId = params["AgrmntId"];
      this.AppId = params["AppId"];
      this.TrxNo = params["TrxNo"];
      this.taskId = params["TaskId"];
      this.ApvReqId = params["ApvReqId"];
      var obj = {
        taskId: params["TaskId"],
        instanceId: params["InstanceId"],
        approvalBaseUrl: environment.ApprovalR3Url
      }

      this.inputObj = obj;

      var ApvHoldObj = new ApprovalObj()
      ApvHoldObj.TaskId = obj.taskId

      this.HoldTask(ApvHoldObj);
    });
  }

  ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    this.http.post(URLConstant.GetRfaLogByTrxNoAndApvCategory, { TrxNo: this.TrxNo, ApvCategory: CommonConstant.ApvCategoryPreGoLive }).subscribe(
      (response) => {
        this.result = response;
        this.ListRfaLogObj = response["ListRfaLogObj"];
        for (let i = 0; i < this.ListRfaLogObj.length; i++) {
          this.listPreGoLiveAppvrObj[i] = {
            approvalBaseUrl: environment.ApprovalR3Url,
            type: 'task',
            refId: this.ListRfaLogObj[i]["RfaNo"],
            apvStat: this.ListRfaLogObj[i]["ApvStat"],
          }
        }
        this.IsApvReady = true;
      });

    this.http.post(URLConstant.GetListTCbyAppId, { AppId: this.AppId }).subscribe(
      (response) => {
        this.TCList = response["AppTcs"];
      });

    var Obj = {
      AgrmntNo: this.TrxNo,
      RowVersion: ""
    }


    this.http.post(URLConstant.GetAgrmntByAppIdGetAgrmntByAgrmntNo, Obj).subscribe(
      (response) => {
        this.result = response;
        this.AgrmntNo = this.result.AgrmntNo;
        this.CustNo = this.result.CustNo;
        this.CustName = this.result.CustName;
        this.OfficeName = this.result.OfficeName;
        this.NumOfAsset = this.result.NumOfAsset;
        this.Tenor = this.result.Tenor;
        this.ProdOfferingName = this.result.ProdOfferingName;
        this.ProdOfferingCode = this.result.ProdOfferingCode;
        this.ProdOfferingVersion = this.result.ProdOfferingVersion;
        var Obj2 = {
          ProdOfferingCode: this.result.ProdOfferingCode,
          RefProdCompntCode: CommonConstant.RefProdCompntCodeWayOfFinancing,
          RowVersion: ""
        }
        this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeAndACTProdStat, Obj2).subscribe(
          (response) => {
            this.result2 = response;
            this.WayOfFinancing = this.result2.CompntValueDesc;
          }
        );

        var Obj3 = {
          ProdOfferingCode: this.result.ProdOfferingCode,
          RefProdCompntCode: CommonConstant.RefProdCompntCodePurposeOfFinancing,
          RowVersion: ""
        }
        this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeAndACTProdStat, Obj3).subscribe(
          (response) => {
            this.result3 = response;
            this.PurposeOfFinancing = this.result3.CompntValueDesc;
          }
        );


        var Obj4 = {
          AppId: this.result.AppId,
          RowVersion: ""
        }
        this.http.post(URLConstant.GetAppById, Obj4).subscribe(
          (response) => {
            this.result4 = response;
            this.AppNo = this.result4.AppNo;

            if (this.result4.LeadId != null || this.result4.LeadId != undefined) {
              this.http.post(URLConstant.GetLeadByLeadId, { LeadId: this.result4.LeadId }).subscribe(
                (response) => {
                  this.LeadNo = response["LeadNo"];
                  this.LeadId = response["LeadId"];
                }
              );
            }

            this.http.post(URLConstant.GetMouCustByAppId, Obj4).subscribe(
              (response) => {
                this.MouNo = response["MouCustNo"];
                this.MouCustId = response["MouCustId"];
              }
            );


          }

        );


        var Obj5 = {
          AgrmntId: this.result.AgrmntId,
          RowVersion: ""
        }
        this.http.post(URLConstant.GetDeliveryOrderHByAgrmntId, Obj5).subscribe(
          (response) => {
            this.result5 = response;
            this.DeliveryDt = formatDate(this.result5.DeliveryDt, 'yyyy-MM-dd', 'en-US');

          }
        );

        this.http.post(URLConstant.GetAgrmntFinDataByAgrmntId, Obj5).subscribe(
          (response) => {
            this.result6 = response;
            this.InstAmt = this.result6.InstAmt;
          }
        );

      }
    );
    this.initInputApprovalObj();

  }
  HoldTask(obj: ApprovalObj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      () => {
      },
      () => {
        AdInsHelper.RedirectUrl(this.router, ["/Nap/AdminProcess/PreGoLive/Approval/Paging"], { "BizTemplateCode": this.bizTemplateCode });
      }
    )
  }

  //nanti bakalan ke View, sementara kek gini dlu

  OpenView(key: string) {
    if (key == 'app') {
      AdInsHelper.OpenAppViewByAppId(this.AppId);
    } else if (key == 'agrmnt') {
      AdInsHelper.OpenAgrmntViewByAgrmntId(this.AgrmntId);
    } else if (key == 'lead') {
      AdInsHelper.OpenLeadViewByLeadId(this.LeadId);
    } else if (key == 'mou') {
      AdInsHelper.OpenMOUCustViewByMouCustId(this.MouCustId);
    } else if (key == 'cust') {
      var custObj = { CustNo: this.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"])
        });
    } else if (key == 'prod') {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(this.ProdOfferingCode, this.ProdOfferingVersion);
    }
  }

  onAvailableNextTask() {

  }
  onApprovalSubmited() {

    AdInsHelper.RedirectUrl(this.router, ["/Nap/AdminProcess/PreGoLive/Approval/Paging"], { "BizTemplateCode": this.bizTemplateCode });

    this.outstandingTcObj = new OutstandingTcObj();
    this.listAppTCObj = new ListAppTCObj();
    this.listAppTCObj.AppTCObj = new Array();

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
      this.listAppTCObj.AppTCObj.push(this.appTC);
    }

    this.outstandingTcObj.ListAppTCObj = this.listAppTCObj.AppTCObj;

    this.http.post(URLConstant.SubmitOutstandingTc, this.outstandingTcObj).subscribe(
      () => {
        // this.toastr.successMessage("Success");
        AdInsHelper.RedirectUrl(this.router, ["/Nap/AdminProcess/PreGoLive/Approval/Paging"], { "BizTemplateCode": this.bizTemplateCode });
      }
    );
  }

  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router, ["/Nap/AdminProcess/PreGoLive/Approval/Paging"], { "BizTemplateCode": localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE) });
  }

  openView(custNo) {
    var custObj = { CustNo: custNo };
    this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
      response => {
        AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
      });
  }
  initInputApprovalObj() {
    this.UcInputApprovalGeneralInfoObj = new UcInputApprovalGeneralInfoObj();
    this.UcInputApprovalGeneralInfoObj.EnvUrl = environment.FoundationR3Url;
    this.UcInputApprovalGeneralInfoObj.PathUrl = "/Approval/GetSingleTaskInfo";
    this.UcInputApprovalGeneralInfoObj.TaskId = this.taskId;

    this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
    this.InputApprovalHistoryObj.EnvUrl = environment.FoundationR3Url;
    this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
    this.InputApprovalHistoryObj.RequestId = this.ApvReqId;

    this.InputApvObj = new UcInputApprovalObj();
    this.InputApvObj.TaskId = this.taskId;
    this.InputApvObj.EnvUrl = environment.FoundationR3Url;
    this.InputApvObj.PathUrlGetLevelVoting = URLConstant.GetLevelVoting;
    this.InputApvObj.PathUrlGetPossibleResult = URLConstant.GetPossibleResult;
    this.InputApvObj.PathUrlSubmitApproval = URLConstant.SubmitApproval;
    this.InputApvObj.PathUrlGetNextNodeMember = URLConstant.GetNextNodeMember;
    this.InputApvObj.PathUrlGetReasonActive = URLConstant.GetRefReasonActive;
    this.InputApvObj.PathUrlGetChangeFinalLevel = URLConstant.GetCanChangeMinFinalLevel;
    this.InputApvObj.TrxNo = this.AgrmntNo;
    this.InputApvObj.PathUrlGetHistory = URLConstant.GetTaskHistory;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.IsReady = true;
  }
}
