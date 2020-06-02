import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-credit-approval-detail',
  templateUrl: './credit-approval-detail.component.html',
  styleUrls: []
})
export class CreditApprovalDetailComponent implements OnInit {
    appId: number;
  mrCustTypeCode: string;
  viewObj: string;
  arrValue = [];
  type: string;
  inputObj: { taskId: any; instanceId: any; approvalBaseUrl: string; };
  ManualDeviationData;
  isExistedManualDeviationData;

  constructor(private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
      }
      if (params["MrCustTypeCode"] != null) {
        this.mrCustTypeCode = params["MrCustTypeCode"];
      }
      var obj = {
        taskId: params["TaskId"],
        instanceId: params["InstanceId"],
        approvalBaseUrl: environment.ApprovalR3Url
      }
      this.inputObj = obj;
    });
  }
  async ngOnInit(): Promise<void> {
    this.arrValue.push(this.appId);
    this.viewObj = "./assets/ucviewgeneric/viewCreditApprovalInfo.json";

  }
  onAvailableNextTask() {

  }
  onApprovalSubmited() {
    this.toastr.successMessage("Success");
    this.router.navigate(["/Nap/CreditProcess/CreditApproval/Paging"]);
  }
}
