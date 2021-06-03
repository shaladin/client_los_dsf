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
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqGetProdOffDByProdOffCodeAndProdCompntCodeObj } from 'app/shared/model/Request/Product/ReqGetProdOfferingObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { ReqGetRfaLogByTrxNoAndApvCategoryObj } from 'app/shared/model/Request/NAP/PreGoLive/ReqGetRfaLogByTrxNoAndApvCategoryObj.model';
import { AgrmntMasterXObj } from 'app/shared/model/AgrmntMasterXObj.Model';
import { RfaObj } from 'app/shared/model/Approval/RfaObj.Model';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { ProdOfferingDObj } from 'app/shared/model/Product/ProdOfferingDObj.model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { DeliveryOrderHObj } from 'app/shared/model/DeliveryOrderHObj.Model';
import { AgrmntFinDataObj } from 'app/shared/model/AgrmntFinData.Model';

@Component({
  selector: 'app-pre-go-live-approval-detail',
  templateUrl: './pre-go-live-approval-detail.component.html'
})
export class PreGoLiveApprovalDetailComponent implements OnInit {
  viewObj: string;
  TrxNo: string;
  AgrmntNo: string;
  result: AgrmntObj;
  result4: NapAppModel;
  arrValue = [];
  TCList: Array<AppTCObj> = new Array();
  AppNo: string;
  NumOfAsset: number;
  Tenor: number;
  InstAmt: number;
  DeliveryDt: string;
  ProdOfferingName: string;
  WayOfFinancing: string;
  CustNo: string;
  CustName: string;
  OfficeName: string;
  PurposeOfFinancing: string;
  ProdOfferingCode: string;
  ProdOfferingVersion: string;
  LeadNo: string;
  MouNo: string;
  identifier: string = "TCList";
  AgrmntParentNo: string = "-"
  IsApvReady: boolean = false;
  outstandingTcObj: any;
  listAppTCObj: ListAppTCObj;
  appTC: AppTCObj;
  count1: number = 0;
  ListRfaLogObj: Array<RfaObj>;
  listPreGoLiveAppvrObj: Array<any> = new Array();
  CustNoObj: GenericObj = new GenericObj();

  AppId: number;
  AgrmntId: number;
  token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  LeadId: number;
  bizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  MouCustId: number;
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

      var ApvHoldObj = new ApprovalObj()
      ApvHoldObj.TaskId = this.taskId;

      this.HoldTask(ApvHoldObj);
    });
  }

  ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    let reqGetRfaLogByTrxNoAndApvCategoryObj = new ReqGetRfaLogByTrxNoAndApvCategoryObj();
    reqGetRfaLogByTrxNoAndApvCategoryObj.TrxNo = this.TrxNo;
    reqGetRfaLogByTrxNoAndApvCategoryObj.ApvCategory = CommonConstant.ApvCategoryPreGoLive;
    this.http.post(URLConstant.GetRfaLogByTrxNoAndApvCategory, reqGetRfaLogByTrxNoAndApvCategoryObj).subscribe(
      (response) => {
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

    this.http.post(URLConstant.GetListTCbyAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.TCList = response["AppTcs"];
      });

    var Obj = {
      TrxNo: this.TrxNo, // AgrmntNo
      RowVersion: ""
    }

    this.http.post<AgrmntMasterXObj>(URLConstant.GetParentAgrNoByAppId, { AppId: this.AppId }).subscribe(
      (response) => {
        if (response != null) {
          this.AgrmntParentNo = response.AgrmntParentNo != null ? response.AgrmntParentNo : '-';
        }
    })

    this.http.post(URLConstant.GetAgrmntByAgrmntNo, Obj).subscribe(
      (response: AgrmntObj) => {
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
        var Obj2: ReqGetProdOffDByProdOffCodeAndProdCompntCodeObj = new ReqGetProdOffDByProdOffCodeAndProdCompntCodeObj();
        Obj2 = {
          ProdOfferingCode: this.result.ProdOfferingCode,
          RefProdCompntCode: CommonConstant.RefProdCompntCodeWayOfFinancing
        }
        this.http.post(URLConstant.GetCurrentProdOfferingDByProdOfferingCodeAndRefProdCompntCode, Obj2).subscribe(
          (response: ProdOfferingDObj) => {
            this.WayOfFinancing = response.CompntValueDesc;
          }
        );

        var Obj3: ReqGetProdOffDByProdOffCodeAndProdCompntCodeObj = new ReqGetProdOffDByProdOffCodeAndProdCompntCodeObj();
        Obj3 = {
          ProdOfferingCode: this.result.ProdOfferingCode,
          RefProdCompntCode: CommonConstant.RefProdCompntCodePurposeOfFinancing
        }
        this.http.post(URLConstant.GetCurrentProdOfferingDByProdOfferingCodeAndRefProdCompntCode, Obj3).subscribe(
          (response: ProdOfferingDObj) => {
            this.PurposeOfFinancing = response.CompntValueDesc;
          }
        );


        var Obj4 = {
          Id: this.result.AppId,
          RowVersion: ""
        }
        this.http.post(URLConstant.GetAppById, Obj4).subscribe(
          (response: NapAppModel) => {
            this.result4 = response;
            this.AppNo = this.result4.AppNo;

            if (this.result4.LeadId != null || this.result4.LeadId != undefined) {
              this.http.post(URLConstant.GetLeadByLeadId, { Id: this.result4.LeadId }).subscribe(
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
          Id: this.result.AgrmntId,
          RowVersion: ""
        }
        this.http.post(URLConstant.GetDeliveryOrderHByAgrmntId, Obj5).subscribe(
          (response: DeliveryOrderHObj) => {
            this.DeliveryDt = formatDate(response.DeliveryDt, 'yyyy-MM-dd', 'en-US');

          }
        );

        var agrmntObj = {
          Id: this.result.AgrmntId
        }
        this.http.post(URLConstant.GetAgrmntFinDataByAgrmntId, agrmntObj).subscribe(
          (response: AgrmntFinDataObj) => {
            this.InstAmt = response.InstAmt;
          }
        );

        this.IsReady = true;
      }
    );
    this.initInputApprovalObj();
  }

  HoldTask(obj: ApprovalObj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      () => {
      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_PGL_APPRVL_PAGING],{ "BizTemplateCode": this.bizTemplateCode });
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
      this.CustNoObj.CustNo = this.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"])
        });
    } else if (key == 'prod') {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(this.ProdOfferingCode, this.ProdOfferingVersion);
    }
  }

  onAvailableNextTask() {

  }

  onApprovalSubmited(event) {
    this.outstandingTcObj = new OutstandingTcObj(); 
    this.listAppTCObj = new ListAppTCObj();
    this.listAppTCObj.AppTCObj = new Array();

    for (var i = 0; i < this.TCList["length"]; i++) {
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.TCList[i].AppId;
      this.appTC.AppTcId = this.TCList[i].AppTcId;
      this.appTC.TcCode = this.TCList[i].TcCode;
      this.appTC.TcName = this.TCList[i].TcName;
      this.appTC.PriorTo = this.TCList[i].PriorTo;
      this.appTC.IsChecked = this.TCList[i].IsChecked;
      this.appTC.ExpiredDt = this.TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.TCList[i].CheckedDt;
      this.appTC.Notes = this.TCList[i].Notes;
      this.listAppTCObj.AppTCObj.push(this.appTC);
    }

    this.outstandingTcObj.ListAppTCObj = this.listAppTCObj.AppTCObj;

    this.http.post(URLConstant.SubmitOutstandingTc, this.outstandingTcObj).subscribe(
      () => {
        // this.toastr.successMessage("Success");
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_PGL_APPRVL_PAGING],{ "BizTemplateCode": this.bizTemplateCode });
      }
    );
  }

  onCancelClick() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_PGL_APPRVL_PAGING],{ "BizTemplateCode": localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE) });
  }

  openView(custNo) {
    this.CustNoObj.CustNo = custNo;
    this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
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
    this.InputApvObj.TrxNo = this.AgrmntNo;
    this.InputApvObj.RequestId = this.ApvReqId;
    this.IsReady = true;
  }
}
