import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-approval-hist',
  templateUrl: './approval-hist.component.html',
  styleUrls: []
})
export class ApprovalHistComponent implements OnInit {

  @Input() AppId;
  AppNo;
  result: any;
  constructor(private http: HttpClient) { }

  RfaLogObj: {
    RfaNo: any
  }
  ListRfaLogObj: any = new Array(this.RfaLogObj);
  inputObj: any;
  listCreditApprvObj: any = new Array(this.inputObj);
  listPckgValObj: any = new Array(this.inputObj);
  listPreGoObj: any = new Array(this.inputObj);
  IsApvReady: boolean = false;
  count1: number = 0;
  count2: number = 0;
  count3: number = 0;

  ngOnInit() {

    this.http.post(AdInsConstant.GetAppById, { AppId: this.AppId }).subscribe(
      (response) => {
        this.AppNo = response["AppNo"];
        console.log(this.AppNo);
        this.http.post(AdInsConstant.GetRfaLogByTrxNo, { TrxNo: this.AppNo }).subscribe(
          (response) => {
            console.log(response);
            this.result = response;
            this.ListRfaLogObj = response["ListRfaLogObj"];
            console.log(this.ListRfaLogObj);
            for (let i = 0; i < this.ListRfaLogObj.length; i++) {
              if (this.ListRfaLogObj[i]["ApvCategory"] == "CRD_APV") {
                console.log(this.ListRfaLogObj[i]["RfaNo"])
                this.listCreditApprvObj[i] = {
                  approvalBaseUrl: environment.ApprovalR3Url,
                  type: 'task',
                  refId: this.ListRfaLogObj[i]["RfaNo"],
                  apvStat: this.ListRfaLogObj[i]["ApvStat"]
                };
                this.count1++;
              } else if (this.ListRfaLogObj[i]["ApvCategory"] == "PCKG_VLDT_APV") {
                console.log(this.ListRfaLogObj[i]["RfaNo"])
                this.listPckgValObj[i] = {
                  approvalBaseUrl: environment.ApprovalR3Url,
                  type: 'task',
                  refId: this.ListRfaLogObj[i]["RfaNo"],
                  apvStat: this.ListRfaLogObj[i]["ApvStat"]
                };
                this.count2++;
              } else if (this.ListRfaLogObj[i]["ApvCategory"] == "PRE_GPV_APV") {
                console.log(this.ListRfaLogObj[i]["RfaNo"])
                this.listPreGoObj[i] = {
                  approvalBaseUrl: environment.ApprovalR3Url,
                  type: 'task',
                  refId: this.ListRfaLogObj[i]["RfaNo"],
                  apvStat: this.ListRfaLogObj[i]["ApvStat"]
                };
                this.count3++;
              }
            }
            this.IsApvReady = true;
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
