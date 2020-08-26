import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ReturnHandlingHObj } from 'app/shared/model/ReturnHandling/ReturnHandlingHObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';


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
  BizTemplateCode: string;
  AppObj: AppObj;


  constructor(private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient) {
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

      var ApvHoldObj = new ApprovalObj()
      ApvHoldObj.TaskId = obj.taskId

      this.HoldTask(ApvHoldObj);
    });
  }
  async ngOnInit(): Promise<void> {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.arrValue.push(this.appId);
    this.viewObj = "./assets/ucviewgeneric/viewCreditApprovalInfo.json";
    this.getApp();
  }

  HoldTask(obj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error) => {
        this.router.navigate(["/Nap/CreditProcess/CreditApproval/Paging"], { queryParams: { "BizTemplateCode": this.BizTemplateCode } });
      }
    )
  }

  getApp() {
    var appObj = new AppObj();
    appObj.AppId = this.appId
    this.http.post<AppObj>(URLConstant.GetAppById, appObj).subscribe(
      (response) => {
        this.AppObj = response;
      });
  }
  onAvailableNextTask() {

  }
  onApprovalSubmited(event) {
    if (event.result.toLowerCase() == CommonConstant.ApvResultReturn.toLowerCase()) {
      var returnHandlingHObj = new ReturnHandlingHObj();
      var user = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));

      returnHandlingHObj.AppId = this.appId;
      returnHandlingHObj.AgrmntId = null;
      returnHandlingHObj.ReturnBy = user.UserName;
      returnHandlingHObj.ReturnDt = user.BusinessDt;
      returnHandlingHObj.ReturnNotes = event.notes;
      returnHandlingHObj.ReturnFromTrxType = this.AppObj.AppCurrStep;

      this.http.post(URLConstant.AddReturnHandlingH, returnHandlingHObj).subscribe(
        (response) => {
          this.toastr.successMessage("Success");
          this.router.navigate(["/Nap/CreditProcess/CreditApproval/Paging"], { queryParams: { "BizTemplateCode": this.BizTemplateCode } });
        });

    } 
    else if(event.result.toLowerCase() == CommonConstant.ApvResultRejectFinal.toLowerCase()){
      console.log("cust neg");
      var NegCustObj = {
        AppId: this.appId,
        MrNegCustSourceCode: CommonConstant.NegCustSourceCodeConfins,
        NegCustCause: event.reason
      };
      this.http.post(URLConstant.AddNegativeCustByAppId, NegCustObj).subscribe(
        (response) => {
          this.toastr.successMessage("Success");
          this.router.navigate(["/Nap/CreditProcess/CreditApproval/Paging"], { queryParams: { "BizTemplateCode": this.BizTemplateCode } });
        });
    } else {
      this.toastr.successMessage("Success");
      this.router.navigate(["/Nap/CreditProcess/CreditApproval/Paging"], { queryParams: { "BizTemplateCode": this.BizTemplateCode } });
    }
  }

  onCancelClick() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.USER_ACCESS)
    this.router.navigate(["/Nap/CreditProcess/CreditApproval/Paging"], { queryParams: { "BizTemplateCode": BizTemplateCode } });
  }
}
