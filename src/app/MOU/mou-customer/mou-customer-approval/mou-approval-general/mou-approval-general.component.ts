import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-mou-approval-general',
  templateUrl: './mou-approval-general.component.html',
  providers: [NGXToastrService]
})
export class MouApprovalGeneralComponent implements OnInit {
  mouCustObj: MouCustObj;
  MouCustId : number;
  taskId: number;
  instanceId: number;
  MouType : string = "GENERAL";
  inputObj: any;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {

      if (params["MouCustId"] != null) {
        this.MouCustId = params["MouCustId"];
      }

      var obj = {
        taskId: params["TaskId"],
        instanceId: params["InstanceId"],
        approvalBaseUrl: environment.ApprovalR3Url
      }

      this.inputObj = obj;
    });
  }
  

  ngOnInit() {
  }

  MouApprovalDataForm = this.fb.group({
  })

  onAvailableNextTask(event)
  {
    
  }

  onApprovalSubmited(event)
  {
    this.toastr.successMessage("Success");
    this.router.navigate(["/Mou/Cust/Approval"]);
  }
}
