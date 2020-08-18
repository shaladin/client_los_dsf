import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustRvwHObj } from 'app/shared/model/MouCustRvwHObj.Model';
import { MouCustRvwDObj } from 'app/shared/model/MouCustRvwDObj.Model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-mou-view-approval-history',
  templateUrl: './mou-view-approval-history.component.html',
})
export class MouViewApprovalHistoryComponent implements OnInit {
  @Input() MouCustId: number;
  GetMouCustRvwHByMouCustIdUrl: string;
  GetListMouCustRvwDUrl: string;
  responseMouCustRvwH: MouCustRvwHObj;
  mouCustRvwHObj: MouCustRvwHObj;
  mouCustRvwDObj: MouCustRvwDObj;
  listMouCustRvwDObj: any;
  MouCustNo: string;
  MrMouTypeCode: string;
  result: any;
  IsApvReady: boolean = false;
  constructor(private http: HttpClient, private router: Router) {
    this.GetMouCustRvwHByMouCustIdUrl = URLConstant.GetMouCustRvwHByMouCustId;
    this.GetListMouCustRvwDUrl = URLConstant.GetListMouCustRvwD;
  }

  RfaLogObj: {
    RfaNo: any
  }
  ListRfaLogObj: any = new Array(this.RfaLogObj);
  inputObj: any;
  listMouAppvrObj: any = new Array(this.inputObj);
  count1: number = 0;

  ngOnInit() {
    this.http.post(URLConstant.GetMouCustById, { MouCustID: this.MouCustId }).subscribe(
      (response) => {
        this.MouCustNo = response["MouCustNo"];
        this.MrMouTypeCode = response["MrMouTypeCode"];
        this.http.post(URLConstant.GetRfaLogByTrxNo, { TrxNo: this.MouCustNo }).subscribe(
          (response) => {
            this.result = response;
            this.ListRfaLogObj = response["ListRfaLogObj"];
            for (let i = 0; i < this.ListRfaLogObj.length; i++) {
              if (this.ListRfaLogObj[i]["ApvCategory"] == "MOUC_GEN_APV" && this.MrMouTypeCode == CommonConstant.GENERAL) {
                this.listMouAppvrObj[i] = {
                  approvalBaseUrl: environment.ApprovalR3Url,
                  type: 'task',
                  refId: this.ListRfaLogObj[i]["RfaNo"],
                  apvStat: this.ListRfaLogObj[i]["ApvStat"]
                };
                this.count1++;
              } else if (this.ListRfaLogObj[i]["ApvCategory"] == "MOUC_FCTR_APV" && this.MrMouTypeCode == CommonConstant.FACTORING) {
                this.listMouAppvrObj[i] = {
                  approvalBaseUrl: environment.ApprovalR3Url,
                  type: 'task',
                  refId: this.ListRfaLogObj[i]["RfaNo"],
                  apvStat: this.ListRfaLogObj[i]["ApvStat"]
                };
                this.count1++;
              }
            }
          }
        );
        this.IsApvReady = true;
      });
  }
}
