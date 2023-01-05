import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import {CommonConstantX} from 'app/impl/shared/constant/CommonConstantX';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ReqCreditApvResultExtObj } from 'app/shared/model/request/nap/business-process/req-credit-aproval-result-obj.model';
import { ResCreditApvResultExtObj } from 'app/shared/model/response/nap/business-process/res-credit-aproval-result-obj.model';

@Component({
  selector: 'app-approval-hist-x',
  templateUrl: './approval-hist-x.component.html',
  styleUrls: []
})
export class ApprovalHistXComponent implements OnInit {
  @Input() AppId: number;
  @Input() AppNo: string;
  @Input() BizTemplateCode: string;

  OfferingObj: UcInputApprovalHistoryObj;
  CrdApvObj: UcInputApprovalHistoryObj;
  PregoliveApvObj: UcInputApprovalHistoryObj;
  GoliveApvObj: UcInputApprovalHistoryObj;
  ApvHistObj: UcInputApprovalHistoryObj;
  CrdApvRsltExtObj: UcInputApprovalHistoryObj;
  // ReturnHandlingApvObj: UcInputApprovalHistoryObj;
  DocChecklistApvObj: UcInputApprovalHistoryObj;
  CrdApvMainDataObj: ResCreditApvResultExtObj;

  IsCrdApvReady: boolean = false;
  IsPregoliveApvReady: boolean = false;
  IsGoliveApvReady: boolean = false;
  IsOfferingReady: boolean = false;
  IsApvHistReady: boolean = false;
  IsCrdApvRsltExtReady: boolean = false;
  // IsReturnHandlingApvReady: boolean = false;
  IsDocChecklistApvReady: boolean = false;

  ListRfaLogObj: any;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    if(this.BizTemplateCode === "OPL") {
      await this.GetApvOpl();
    }
    else {
      this.OfferingObj = new UcInputApprovalHistoryObj();
      this.OfferingObj.PathUrl = "/Approval/GetTaskHistory";
      this.OfferingObj.Identifier = "OfferingObj";

      this.CrdApvObj = new UcInputApprovalHistoryObj();
      this.CrdApvObj.PathUrl = "/Approval/GetTaskHistory";
      this.CrdApvObj.Identifier = "CrdApvObj";

      this.PregoliveApvObj = new UcInputApprovalHistoryObj();
      this.PregoliveApvObj.PathUrl = "/Approval/GetTaskHistory";
      this.PregoliveApvObj.Identifier = "PregoliveApvObj";

      this.CrdApvRsltExtObj = new UcInputApprovalHistoryObj();
      this.CrdApvRsltExtObj.PathUrl = "/Approval/GetTaskHistory";
      this.CrdApvRsltExtObj.Identifier = "CrdApvRsltExtObj";

      this.GoliveApvObj = new UcInputApprovalHistoryObj();
      this.GoliveApvObj.PathUrl = "/Approval/GetTaskHistory";
      this.GoliveApvObj.Identifier = "GoliveApvObj";

      this.http.post(URLConstant.GetRfaLogByTrxNo, { TrxNo: this.AppNo }).subscribe(
        (response) => {
          for (let i = 0; i < response['ListRfaLogObj'].length; i++) {
            if (response['ListRfaLogObj'][i]['ApvCategory'] == CommonConstant.ApvCategoryCreditApproval) {
              this.CrdApvObj.RequestId = response['ListRfaLogObj'][i]['RfaNo'];
            }
          }
          this.IsCrdApvReady = true;
        },
        (error) => {
          this.IsCrdApvReady = true;
        }
      );

      await this.http.post(URLConstant.GetAgrmntByAppId, { Id: this.AppId }).subscribe(
        (response) => {
          let agrmntNo = response['AgrmntNo'];
          let agrmntNoPgv = agrmntNo + '_PGLV';
          this.GetOfferingGoLiveObj(agrmntNo);
          this.GetPreGoLiveObj(agrmntNoPgv);

          // this.http.post(URLConstant.GetRfaLogByTrxNo, { TrxNo: agrmntNo }).subscribe(
          //   (response) => {
          //     for (let i = 0; i < response['ListRfaLogObj'].length; i++) {
          //       if (response['ListRfaLogObj'][i]['ApvCategory'] == CommonConstant.ApvCategoryOfferingValidity) {
          //         this.OfferingObj.RequestId = response['ListRfaLogObj'][i]['RfaNo'];
          //       }
          //       if (response['ListRfaLogObj'][i]['ApvCategory'] == CommonConstantX.CAT_CODE_GO_LIVE_APV) {
          //         this.GoliveApvObj.RequestId = response['ListRfaLogObj'][i]['RfaNo'];
          //       }

          //     }
          //     this.IsOfferingReady = true;
          //     this.IsGoliveApvReady = true;
          //   });

          // this.http.post(URLConstant.GetRfaLogByTrxNo, { TrxNo: TrxNoPgv }).subscribe(
          //   (response) => {
          //     for (let i = 0; i < response['ListRfaLogObj'].length; i++) {
          //       if (response['ListRfaLogObj'][i]['ApvCategory'] == CommonConstant.ApvCategoryPreGoLive) {
          //         this.PregoliveApvObj.RequestId = response['ListRfaLogObj'][i]['RfaNo'];
          //       }
          //     }
          //     this.IsPregoliveApvReady = true;
          //   });
        },
        (error) => {
          this.IsCrdApvReady = true;
        }
      );
      this.getCrdApvExt();
    }
  }


  async GetApvOpl() {
    this.ApvHistObj = new UcInputApprovalHistoryObj();
    this.ApvHistObj.PathUrl = "/Approval/GetTaskHistory";

    this.DocChecklistApvObj = new UcInputApprovalHistoryObj();
    this.DocChecklistApvObj.PathUrl = "/Approval/GetTaskHistory";

    this.http.post(URLConstant.GetRfaLogByTrxNo, { TrxNo: this.AppNo }).subscribe(
      (response) => {
        this.ListRfaLogObj = response["ListRfaLogObj"];

        for (let i = 0; i < this.ListRfaLogObj.length; i++) {
          if (this.ListRfaLogObj[i]['ApvCategory'] === CommonConstant.ApvCategoryApplicaitonApproval) {
            this.ApvHistObj.RequestId = this.ListRfaLogObj[i]['RfaNo'];
            this.IsApvHistReady = true;
          }
          if (this.ListRfaLogObj[i]['ApvCategory'] === CommonConstant.ApvCategoryDocumentChecklistApproval) {
            this.DocChecklistApvObj.RequestId = this.ListRfaLogObj[i]['RfaNo'];
            this.IsDocChecklistApvReady = true;
          }
        }
        // this.IsReturnHandlingApvReady = true;
      },
      (error) => {
        this.IsApvHistReady = false;
        // this.IsReturnHandlingApvReady = false;
        this.IsDocChecklistApvReady = false;
      }
    );
  }

  getCrdApvExt(){
    this.http.post(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
      (response) => {
        this.http.post(URLConstant.GetRfaLogByTrxNo, { TrxNo: this.AppNo }).subscribe(
          (response) => {
            for (let i = 0; i < response['ListRfaLogObj'].length; i++) {
              if (response['ListRfaLogObj'][i]['ApvCategory'] == CommonConstant.ApvCategoryCreditApprovalResultExtensionApproval) {
                this.CrdApvRsltExtObj.RequestId = response['ListRfaLogObj'][i]['RfaNo'];
              }
            }
            this.IsCrdApvRsltExtReady = true;
          });
        let requestMainDataObj : ReqCreditApvResultExtObj = new ReqCreditApvResultExtObj();
        requestMainDataObj.AppId = response['AppId'];

        this.http.post<ResCreditApvResultExtObj>(URLConstant.GetCreditApvResultExtMainData, requestMainDataObj).subscribe(
          response => {
            this.CrdApvMainDataObj = response;
          }
        );
      }
    );
  }

  async GetOfferingGoLiveObj(obj: any){
    await this.http.post(URLConstant.GetRfaLogByTrxNo, { TrxNo: obj }).toPromise().then(
      (response) => {
        for (let i = 0; i < response['ListRfaLogObj'].length; i++) {
          if (response['ListRfaLogObj'][i]['ApvCategory'] == CommonConstant.ApvCategoryOfferingValidity) {
            this.OfferingObj.RequestId = response['ListRfaLogObj'][i]['RfaNo'];
          }
          if (response['ListRfaLogObj'][i]['ApvCategory'] == CommonConstantX.CAT_CODE_GO_LIVE_APV) {
            this.GoliveApvObj.RequestId = response['ListRfaLogObj'][i]['RfaNo'];
          }

        }
        this.IsOfferingReady = true;
        this.IsGoliveApvReady = true;
      });
  }

  async GetPreGoLiveObj(obj: any){
    await this.http.post(URLConstant.GetRfaLogByTrxNo, { TrxNo: obj }).toPromise().then(
      (response) => {
        for (let i = 0; i < response['ListRfaLogObj'].length; i++) {
          if (response['ListRfaLogObj'][i]['ApvCategory'] == CommonConstant.ApvCategoryPreGoLive) {
            this.PregoliveApvObj.RequestId = response['ListRfaLogObj'][i]['RfaNo'];
          }
        }
        this.IsPregoliveApvReady = true;
      });
  }

}
