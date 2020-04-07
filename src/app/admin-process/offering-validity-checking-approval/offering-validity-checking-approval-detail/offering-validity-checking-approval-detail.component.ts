import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-offering-validity-checking-approval-detail',
  templateUrl: './offering-validity-checking-approval-detail.component.html',
  styleUrls: ['./offering-validity-checking-approval-detail.component.scss']
})
export class OfferingValidityCheckingApprovalDetailComponent implements OnInit {
  viewObj: string;
  inputObj: { taskId: any; instanceId: any; approvalBaseUrl: any; };

  constructor(private router: Router, private route: ActivatedRoute, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {

      var obj = {
        taskId: params["TaskId"],
        instanceId: params["InstanceId"],
        approvalBaseUrl: environment.ApprovalURL
      }

      this.inputObj = obj;
    });
  }

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewOfferingValidityCheckingApproval.json";

    

  }

}
