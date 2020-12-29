import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';
import { ReturnHandlingHObj } from 'app/shared/model/ReturnHandling/ReturnHandlingHObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-credit-approval-cr-detail',
  templateUrl: './credit-approval-cr-detail.component.html',
})
export class CreditApprovalCrDetailComponent implements OnInit {

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
    await this.getApp();
  }

  HoldTask(obj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error) => {
        AdInsHelper.RedirectUrl(this.router,["/Nap/CreditProcess/CreditApprovalCr/Paging"], { "BizTemplateCode": this.BizTemplateCode });
      }
    )
  }
  
  crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  isShow: boolean = false;
  GetResultCrdRvwCustInfoObj(ev: CrdRvwCustInfoObj) {
    this.crdRvwCustInfoObj = ev;
    console.log(ev);
    this.isShow = true;
  }

  //#region Uc Approval 
  async getApp() {
    let appObj = new AppObj();
    appObj.AppId = this.appId
    await this.http.post<AppObj>(URLConstant.GetAppById, appObj).toPromise().then(
      (response) => {
        this.AppObj = response;
      });
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
          AdInsHelper.RedirectUrl(this.router,["/Nap/CreditProcess/CreditApprovalCr/Paging"], { "BizTemplateCode": this.BizTemplateCode });
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
          AdInsHelper.RedirectUrl(this.router,["/Nap/CreditProcess/CreditApprovalCr/Paging"], { "BizTemplateCode": this.BizTemplateCode });
        });
    } else {
      this.toastr.successMessage("Success");
      AdInsHelper.RedirectUrl(this.router,["/Nap/CreditProcess/CreditApprovalCr/Paging"], { "BizTemplateCode": this.BizTemplateCode });
    }
  }

  onAvailableNextTask() {

  }
  
  onCancelClick() {
    var BizTemplateCode = localStorage.getItem(CommonConstant.USER_ACCESS);
    AdInsHelper.RedirectUrl(this.router,["/Nap/CreditProcess/CreditApprovalCr/Paging"], { "BizTemplateCode": BizTemplateCode });
  }
  //#endregion
}
