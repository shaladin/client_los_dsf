import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

@Component({
  selector: 'app-offering-validity-checking-approval-detail',
  templateUrl: './offering-validity-checking-approval-detail.component.html'
})
export class OfferingValidityCheckingApprovalDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  BizTemplateCode : string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  inputObj: { taskId: any; instanceId: any; approvalBaseUrl: any; };
  token: any = localStorage.getItem(CommonConstant.TOKEN);
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
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewOfferingValidityCheckingApproval.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
      {
        name: "AgrmntNo",
        environment: environment.losR3Web
      },
    ];
  }

  HoldTask(obj){
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      (response)=>{
      },
      (error)=>{
        AdInsHelper.RedirectUrl(this.router,["/Nap/AdminProcess/OfferingValidityApproval/Paging"],{ "BizTemplateCode": this.BizTemplateCode});
      }
    )
  }
  
  onAvailableNextTask() {

  }
  onApprovalSubmited() {
    this.toastr.successMessage("Success");
    AdInsHelper.RedirectUrl(this.router,["/Nap/AdminProcess/OfferingValidityApproval/Paging"],{ "BizTemplateCode": this.BizTemplateCode});
  }

  onCancelClick()
  {
    AdInsHelper.RedirectUrl(this.router,["/Nap/AdminProcess/OfferingValidityApproval/Paging"],{ "BizTemplateCode": this.BizTemplateCode});
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

}
