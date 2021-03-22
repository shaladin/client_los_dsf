import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';

@Component({
  selector: 'app-approval-hist',
  templateUrl: './approval-hist.component.html',
  styleUrls: []
})
export class ApprovalHistComponent implements OnInit {

  @Input() AppId : number;
  @Input() AppNo : string;
  OfferingObj: UcInputApprovalHistoryObj;
  IsApvReady: boolean;
  CrdApvObj: UcInputApprovalHistoryObj;
  IsCrdApvReady: boolean = false;
  IsPregoliveApvReady: boolean = false;
  IsOfferingReady : boolean = false;
  PregoliveApvObj: UcInputApprovalHistoryObj;
  constructor(private http: HttpClient) { }

  async ngOnInit() {
    this.OfferingObj = new UcInputApprovalHistoryObj();
    this.OfferingObj.EnvUrl = environment.FoundationR3Url;
    this.OfferingObj.PathUrl = "/Approval/GetTaskHistory";

    this.CrdApvObj = new UcInputApprovalHistoryObj();
    this.CrdApvObj.EnvUrl = environment.FoundationR3Url;
    this.CrdApvObj.PathUrl = "/Approval/GetTaskHistory";

    this.PregoliveApvObj = new UcInputApprovalHistoryObj();
    this.PregoliveApvObj.EnvUrl = environment.FoundationR3Url;
    this.PregoliveApvObj.PathUrl = "/Approval/GetTaskHistory";
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
            }
            this.IsPregoliveApvReady = true;
            this.IsOfferingReady = true;

          });

      },
      (error) => {
        this.IsCrdApvReady = true;
      }
    );
  }
}
