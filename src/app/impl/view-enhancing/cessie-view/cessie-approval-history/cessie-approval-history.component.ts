import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';

@Component({
  selector: 'cessie-approval-history-view',
  templateUrl: './cessie-approval-history.component.html'
})

export class CessieApprovalHistoryComponent implements OnInit {
  @Input() CessieHXId: number;

  GoliveApvObj: UcInputApprovalHistoryObj;
  ApvHistObj: UcInputApprovalHistoryObj;

  IsGoliveApvReady: boolean = false;
  IsApvHistReady: boolean = false;

  ListRfaLogObj: any;

  constructor(private http: HttpClient) { }

  async ngOnInit() {

    this.GoliveApvObj = new UcInputApprovalHistoryObj();
    this.GoliveApvObj.PathUrl = "/Approval/GetTaskHistory";
    this.http.post(URLConstantX.GetCessieHXById, { Id: this.CessieHXId }).subscribe(
      (response) => {
        let cessieNo = "";
        if (response['CessieStatus'] != "CAN") {
          cessieNo = response['CessieNo'];
          this.http.post(URLConstant.GetRfaLogByTrxNo, { TrxNo: cessieNo }).subscribe(
            (response) => {
              for (let i = 0; i < response['ListRfaLogObj'].length; i++) {
                if (response['ListRfaLogObj'][i]['ApvCategory'] == CommonConstantX.CESSIE_PRE_GPV_APV_CATEGORY) {
                  this.GoliveApvObj.RequestId = response['ListRfaLogObj'][i]['RfaNo'];
                }
              }
              this.IsGoliveApvReady = true;
            });
        } else{
          this.IsGoliveApvReady = true;
        }
      },
    );
  }
}
