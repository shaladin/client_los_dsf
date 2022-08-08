import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';

@Component({
  selector: 'app-approval-hist',
  templateUrl: './approval-hist.component.html',
  styleUrls: []
})
export class ApprovalHistComponent implements OnInit {
  @Input() AppId: number;
  @Input() AppNo: string;
  @Input() BizTemplateCode: string;

  OfferingObj: UcInputApprovalHistoryObj;
  CrdApvObj: UcInputApprovalHistoryObj;
  PregoliveApvObj: UcInputApprovalHistoryObj;
  ApvHistObj: UcInputApprovalHistoryObj;
  CrdApvRsltExtObj: UcInputApprovalHistoryObj;
  // ReturnHandlingApvObj: UcInputApprovalHistoryObj;
  DocChecklistApvObj: UcInputApprovalHistoryObj;

  IsCrdApvReady: boolean = false;
  IsPregoliveApvReady: boolean = false;
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

      this.CrdApvObj = new UcInputApprovalHistoryObj();
      this.CrdApvObj.PathUrl = "/Approval/GetTaskHistory";

      this.PregoliveApvObj = new UcInputApprovalHistoryObj();
      this.PregoliveApvObj.PathUrl = "/Approval/GetTaskHistory";

      this.CrdApvRsltExtObj = new UcInputApprovalHistoryObj();
      this.CrdApvRsltExtObj.PathUrl = "/Approval/GetTaskHistory";

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

      this.http.post(URLConstant.GetAgrmntByAppId, { Id: this.AppId }).subscribe(
        (response) => {
          let agrmntNo = response['AgrmntNo'];
          this.http.post(URLConstant.GetRfaLogByTrxNo, { TrxNo: agrmntNo }).subscribe(
            (response) => {
              for (let i = 0; i < response['ListRfaLogObj'].length; i++) {
                if (response['ListRfaLogObj'][i]['ApvCategory'] == CommonConstant.ApvCategoryPreGoLive) {
                  this.PregoliveApvObj.RequestId = response['ListRfaLogObj'][i]['RfaNo'];
                }
                if (response['ListRfaLogObj'][i]['ApvCategory'] == CommonConstant.ApvCategoryOfferingValidity) {
                  this.OfferingObj.RequestId = response['ListRfaLogObj'][i]['RfaNo'];
                }
                if (response['ListRfaLogObj'][i]['ApvCategory'] == CommonConstant.ApvCategoryCreditApprovalResultExtensionApproval) {
                  this.CrdApvRsltExtObj.RequestId = response['ListRfaLogObj'][i]['RfaNo'];
                }
              }
              this.IsPregoliveApvReady = true;
              this.IsOfferingReady = true;
              this.IsCrdApvRsltExtReady = true;
            });
        },
        (error) => {
          this.IsCrdApvReady = true;
        }
      );
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
}