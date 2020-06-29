import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-offering-validity-checking-approval-detail',
  templateUrl: './offering-validity-checking-approval-detail.component.html',
  styleUrls: ['./offering-validity-checking-approval-detail.component.scss']
})
export class OfferingValidityCheckingApprovalDetailComponent implements OnInit {
  viewObj: string;
  BizTemplateCode : string = localStorage.getItem("BizTemplateCode");
  inputObj: { taskId: any; instanceId: any; approvalBaseUrl: any; };
  token: any = localStorage.getItem("Token");
  constructor(private router: Router, private route: ActivatedRoute, private toastr: NGXToastrService, private http:HttpClient) {
    this.route.queryParams.subscribe(params => {

      var obj = {
        taskId: params["TaskId"],
        instanceId: params["InstanceId"],
        approvalBaseUrl: environment.ApprovalR3Url
      }

      this.inputObj = obj;
    
      var ApvHoldObj = new ApprovalObj()
      ApvHoldObj.TaskId = obj.taskId
  
      this.HoldTask(ApvHoldObj);
    });
  }

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewOfferingValidityCheckingApproval.json";
  }

  HoldTask(obj){
    this.http.post(AdInsConstant.ApvHoldTaskUrl, obj).subscribe(
      (response)=>{
        this.toastr.successMessage(response["Message"]);
      },
      (error)=>{
        this.router.navigate(["/Nap/AdminProcess/OfferingValidityApproval/Paging"], { queryParams: { "BizTemplateCode": this.BizTemplateCode } });
      }
    )
  }
  
  onAvailableNextTask() {

  }
  onApprovalSubmited() {
    this.toastr.successMessage("Success");
    this.router.navigate(["/Nap/AdminProcess/OfferingValidityApproval/Paging"], { queryParams: { "BizTemplateCode": this.BizTemplateCode } });
  }

  onCancelClick()
  {
    this.router.navigate(["/Nap/AdminProcess/OfferingValidityApproval/Paging"], { queryParams: { "BizTemplateCode": this.BizTemplateCode } });
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion, this.token);
    }
  }

}
