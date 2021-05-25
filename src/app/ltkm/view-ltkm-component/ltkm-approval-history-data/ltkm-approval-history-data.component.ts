import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model'

@Component({
  selector: 'app-ltkm-approval-hist',
  templateUrl: './ltkm-approval-history-data.component.html',
  styleUrls: []
})
export class LtkmApprovalHistComponent implements OnInit {

  @Input() LtkmNo: string = "";
  constructor(private http: HttpClient) { }

  ListRfaLogObj: UcInputApprovalHistoryObj;

  listCreditApprvObj: UcInputApprovalHistoryObj;
  listPckgValObj: UcInputApprovalHistoryObj;
  listPreGoObj: UcInputApprovalHistoryObj;
  listLtkmObj: UcInputApprovalHistoryObj;
  IsApvReady: boolean = false;
  count1: number = 0;
  count2: number = 0;
  count3: number = 0;
  count4: number = 0;

  ngOnInit() {

    this.ListRfaLogObj = new UcInputApprovalHistoryObj();
    this.ListRfaLogObj.EnvUrl = environment.FoundationR3Url;
    this.ListRfaLogObj.PathUrl = "/Approval/GetTaskHistory";

    this.listCreditApprvObj = new UcInputApprovalHistoryObj();
    this.listCreditApprvObj.EnvUrl = environment.FoundationR3Url;
    this.listCreditApprvObj.PathUrl = "/Approval/GetTaskHistory";

    this.listPckgValObj = new UcInputApprovalHistoryObj();
    this.listPckgValObj.EnvUrl = environment.FoundationR3Url;
    this.listPckgValObj.PathUrl = "/Approval/GetTaskHistory";

    this.listPreGoObj = new UcInputApprovalHistoryObj();
    this.listPreGoObj.EnvUrl = environment.FoundationR3Url;
    this.listPreGoObj.PathUrl = "/Approval/GetTaskHistory";

    this.listLtkmObj = new UcInputApprovalHistoryObj();
    this.listLtkmObj.EnvUrl = environment.FoundationR3Url;
    this.listLtkmObj.PathUrl = "/Approval/GetTaskHistory";

    this.http.post(URLConstant.GetRfaLogByTrxNo, { TrxNo: this.LtkmNo }).subscribe(
      (response) => {
        this.ListRfaLogObj = response["ListRfaLogObj"];
        for (let i = 0; i < response["ListRfaLogObj"].length; i++) {
          if (this.ListRfaLogObj[i]["ApvCategory"] == CommonConstant.ApvCategoryCreditApproval) {
            this.listCreditApprvObj.RequestId = this.ListRfaLogObj[i]["RfaNo"];
            this.count1++;
          } else if (this.ListRfaLogObj[i]["ApvCategory"] == CommonConstant.ApvCategoryPackageValidityChecking) {
            this.listPckgValObj.RequestId = this.ListRfaLogObj[i]["RfaNo"];
            this.count2++;
          } else if (this.ListRfaLogObj[i]["ApvCategory"] == CommonConstant.ApvCategoryPreGoLive) {
            this.listPreGoObj.RequestId = this.ListRfaLogObj[i]["RfaNo"];
            this.count3++;
          } else if (this.ListRfaLogObj[i]["ApvCategory"] == CommonConstant.CAT_CODE_AML_APV) {
            this.listLtkmObj.RequestId = this.ListRfaLogObj[i]["RfaNo"];
            this.count4++;
          }
        }
        this.IsApvReady = true;
      }
    );
  }
}
