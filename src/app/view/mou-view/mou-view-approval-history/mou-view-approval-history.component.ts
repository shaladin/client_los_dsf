import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustRvwHObj } from 'app/shared/model/MouCustRvwHObj.Model';
import { MouCustRvwDObj } from 'app/shared/model/MouCustRvwDObj.Model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';

@Component({
  selector: 'app-mou-view-approval-history',
  templateUrl: './mou-view-approval-history.component.html',
})
export class MouViewApprovalHistoryComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() MouCustNo: string;
  responseMouCustRvwH: MouCustRvwHObj;
  mouCustRvwHObj: MouCustRvwHObj;
  mouCustRvwDObj: MouCustRvwDObj;
  listMouCustRvwDObj: any;
  MrMouTypeCode: string;
  result: any;
  IsApvReady: boolean = false;
  InputApprovalHistoryObj: UcInputApprovalHistoryObj;
  
  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
    this.http.post(URLConstant.GetRfaLogByTrxNo, {TrxNo:this.MouCustNo}).subscribe(
      (response) => {
        this.InputApprovalHistoryObj = new UcInputApprovalHistoryObj();
        this.InputApprovalHistoryObj.EnvUrl = environment.FoundationR3Url;
        this.InputApprovalHistoryObj.PathUrl = "/Approval/GetTaskHistory";
        if(response['ListRfaLogObj'].length > 0){
          this.InputApprovalHistoryObj.RequestId = response['ListRfaLogObj'][0]['RfaNo'];  
        }
        this.IsApvReady = true;
      });
    
  }
}
