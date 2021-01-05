import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import Stepper from 'bs-stepper';
import { ReturnHandlingHObj } from 'app/shared/model/ReturnHandling/ReturnHandlingHObj.Model';
import { AllAppReservedFundObj } from 'app/shared/model/AllAppReservedFundObj.model';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { AppIdObj } from 'app/shared/model/AppIdObj.Model';
import { ResultRefundObj } from 'app/shared/model/AppFinData/ResultRefund.Model';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-commission-reserved-fund-detail',
  templateUrl: './commission-reserved-fund-detail.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class CommissionReservedFundDetailComponent implements OnInit {

  ReturnHandlingHObj: ReturnHandlingHObj;
  AllAppReservedFundObj: AllAppReservedFundObj;
  StepIndex: number = 1;
  private stepper: Stepper;
  returnHandlingDObj: ReturnHandlingDObj;
  showCancel: boolean = true;
  OnFormReturnInfo: boolean = false;
  BizTemplateCode: string;

  Step = {
    "COM": 1,
    "RSV": 2
  };

  HandlingForm = this.fb.group({
    ReturnHandlingNotes: [''],
    ReturnHandlingExecNotes: [''],
  });

  constructor(
    private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService, private router: Router) {
    this.ReturnHandlingHObj = new ReturnHandlingHObj();
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.ReturnHandlingHObj.AppId = params["AppId"];
      }
      if (params["WfTaskListId"] != null) {
        this.ReturnHandlingHObj.WfTaskListId = params["WfTaskListId"];
      }
      if (params["ReturnHandlingHId"] != null) {
        this.ReturnHandlingHObj.ReturnHandlingHId = params["ReturnHandlingHId"];
        this.showCancel = false;
      }
      this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    });
  }

  viewIncomeInfoObj = {
    UppingRate: 0,
    InsuranceIncome: 0,
    LifeInsuranceIncome: 0,
    MaxAllocatedAmount: 0,
    RemainingAllocatedAmount: 0,
    InterestIncome: 0,
    ReservedFundAllocatedAmount: 0,
    ExpenseAmount: 0,
    Other: []
  };

  viewProdMainInfoObj;
  arrValue = [];

  ngOnInit() {
    console.log(this.BizTemplateCode);
    this.isShow = false;
    this.ClaimTask(this.ReturnHandlingHObj.WfTaskListId);
    this.arrValue.push(this.ReturnHandlingHObj.AppId);
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    });
    this.GetAndUpdateAppStep();
    this.MakeViewReturnInfoObj();
    this.GetIncomeInfoObj();
  }

  ListResultRefundIncomeInfo: Array<ResultRefundObj>;
  TotalHalfListResultRefundIncomeInfo: number = 0;
  DictMaxIncomeForm: any = {};
  isView: boolean = false;
  GetIncomeInfoObj() {
    var obj = {
      AppId: this.ReturnHandlingHObj.AppId
    };
    this.http.post<AppFinDataObj>(URLConstant.GetAppFinDataWithRuleByAppId, obj).subscribe(
      (response) => {
        this.ListResultRefundIncomeInfo = response.ResultRefundRsvFundObjs;
        this.TotalHalfListResultRefundIncomeInfo = Math.floor(this.ListResultRefundIncomeInfo.length / 2);
        let totalListResultRefundIncomeInfoAmount = 0;
        for (var i = 0; i < this.ListResultRefundIncomeInfo.length; i++){
          this.DictMaxIncomeForm[this.ListResultRefundIncomeInfo[i].RefundAllocationFrom] = this.ListResultRefundIncomeInfo[i];
          if(this.ListResultRefundIncomeInfo[i].RefundAmount < 0) this.DictMaxIncomeForm[this.ListResultRefundIncomeInfo[i].RefundAllocationFrom].RefundAmount = 0;
          totalListResultRefundIncomeInfoAmount += this.DictMaxIncomeForm[this.ListResultRefundIncomeInfo[i].RefundAllocationFrom].RefundAmount;
        }
        this.isView = true;
        if (totalListResultRefundIncomeInfoAmount < response.MaxAllocatedRefundAmt)
          this.viewIncomeInfoObj.MaxAllocatedAmount = totalListResultRefundIncomeInfoAmount;
        else
          this.viewIncomeInfoObj.MaxAllocatedAmount = response.MaxAllocatedRefundAmt;

        if (this.viewIncomeInfoObj.MaxAllocatedAmount < 0) this.viewIncomeInfoObj.MaxAllocatedAmount = 0;

        this.viewIncomeInfoObj.UppingRate = response.DiffRateAmt,
          this.viewIncomeInfoObj.InsuranceIncome = response.TotalInsCustAmt - response.TotalInsInscoAmt,
          this.viewIncomeInfoObj.LifeInsuranceIncome = response.TotalLifeInsCustAmt - response.TotalLifeInsInscoAmt,
          // this.viewIncomeInfoObj.MaxAllocatedAmount = response.MaxAllocatedRefundAmt,
          this.viewIncomeInfoObj.ReservedFundAllocatedAmount = response.ReservedFundAllocatedAmt,
          this.viewIncomeInfoObj.RemainingAllocatedAmount = this.viewIncomeInfoObj.MaxAllocatedAmount - response.CommissionAllocatedAmt - response.ReservedFundAllocatedAmt,
          this.viewIncomeInfoObj.InterestIncome = response.TotalInterestAmt;
        this.viewIncomeInfoObj.ExpenseAmount = response.CommissionAllocatedAmt;
        this.tempTotalRsvFundAmt = this.viewIncomeInfoObj.ReservedFundAllocatedAmount;
        this.tempTotalExpenseAmt = this.viewIncomeInfoObj.ExpenseAmount;
      });
  }

  NapObj: AppObj = new AppObj();
  GetAndUpdateAppStep() {
    this.NapObj.AppId = this.ReturnHandlingHObj.AppId;
    this.http.post(URLConstant.GetAppById, this.NapObj).subscribe(
      (response: AppObj) => {
        if (response) {
          this.NapObj = response;
          if (this.NapObj.AppCurrStep != CommonConstant.AppStepComm && this.NapObj.AppCurrStep != CommonConstant.AppStepRSVFund) {
            this.NapObj.AppCurrStep = CommonConstant.AppStepComm;
            this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
              (response) => {
                this.ChangeTab(CommonConstant.AppStepComm);
              }
            )
          }
          this.ChangeTab(CommonConstant.AppStepComm);
        }
      });
  }

  MakeViewReturnInfoObj() {
    if (this.ReturnHandlingHObj.ReturnHandlingHId > 0) {
      var obj = {
        ReturnHandlingHId: this.ReturnHandlingHObj.ReturnHandlingHId,
        MrReturnTaskCode: CommonConstant.ReturnHandlingEditComRsvFnd
      }
      this.http.post<ReturnHandlingDObj>(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, obj).subscribe(
        (response) => {
          this.returnHandlingDObj = response;
          this.HandlingForm.patchValue({
            ReturnHandlingExecNotes: this.returnHandlingDObj.ReturnHandlingExecNotes
          });
          this.OnFormReturnInfo = true;
        });
    }
  }

  tempTotalRsvFundAmt: number = 0;
  tempTotalExpenseAmt: number = 0;
  IsLastStep: boolean = false;
  ChangeTab(AppStep) {
    this.isShow = false;
    switch (AppStep) {
      case CommonConstant.AppStepComm:
        this.StepIndex = 1;
        break;
      case CommonConstant.AppStepRSVFund:
        this.StepIndex = 2;
        break;

      default:
        break;
    }

    if (AppStep == CommonConstant.AppStepRSVFund)
      this.IsLastStep = true;
    else
      this.IsLastStep = false;
  }

  NextStep(Step) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
      (response) => {
        this.tempTotalRsvFundAmt = this.viewIncomeInfoObj.ReservedFundAllocatedAmount;
        this.tempTotalExpenseAmt = this.viewIncomeInfoObj.ExpenseAmount;
        this.ChangeTab(Step);
        this.stepper.next();

      }
    )
  }

  LastStepHandler(allAppReservedFundObj: AllAppReservedFundObj) {
    if (allAppReservedFundObj.ReturnHandlingHId != 0) {
      this.AllAppReservedFundObj = allAppReservedFundObj;
      // this.SubmitReturnHandling();
    }
    else {
      var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
      AdInsHelper.RedirectUrl(this.router,["/Nap/CreditProcess/CommissionReservedFund/Paging"],{ BizTemplateCode: lobCode });

    }
  }

  async ClaimTask(WfTaskListId) {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME], isLoading: false };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(() => { });
  }

  SubmitReturnHandling() {
    if (this.ReturnHandlingHObj.ReturnHandlingHId > 0) {
      var ReturnHandlingResult: ReturnHandlingDObj = new ReturnHandlingDObj();
      ReturnHandlingResult.WfTaskListId = this.ReturnHandlingHObj.WfTaskListId;
      ReturnHandlingResult.ReturnHandlingDId = this.returnHandlingDObj.ReturnHandlingDId;
      ReturnHandlingResult.MrReturnTaskCode = this.returnHandlingDObj.MrReturnTaskCode;
      ReturnHandlingResult.ReturnStat = this.returnHandlingDObj.ReturnStat;
      ReturnHandlingResult.ReturnHandlingNotes = this.returnHandlingDObj.ReturnHandlingNotes;
      ReturnHandlingResult.ReturnHandlingExecNotes = this.HandlingForm.controls['ReturnHandlingExecNotes'].value;
      ReturnHandlingResult.RowVersion = this.returnHandlingDObj.RowVersion;

      this.http.post(URLConstant.EditReturnHandlingD, ReturnHandlingResult).subscribe(
        (response) => {
          var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
          AdInsHelper.RedirectUrl(this.router,["/Nap/AddProcess/ReturnHandling/CommissionReservedFund/Paging"],{ "BizTemplateCode": lobCode });
        })
    }
  }

  Back() {
    var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    if (this.ReturnHandlingHObj.ReturnHandlingHId != 0) {
      AdInsHelper.RedirectUrl(this.router,["/Nap/AdditionalProcess/ReturnHandling/CommissionReservedFund/Paging"],{ "BizTemplateCode": lobCode});
    } else {
      AdInsHelper.RedirectUrl(this.router,["/Nap/CreditProcess/CommissionReservedFund/Paging"],{ "BizTemplateCode": lobCode});
    }
  }

  updateRemainingAllocFromCommission(ev: number) {
    this.viewIncomeInfoObj.ExpenseAmount = ev;
    this.viewIncomeInfoObj.RemainingAllocatedAmount = this.viewIncomeInfoObj.MaxAllocatedAmount - this.viewIncomeInfoObj.ExpenseAmount - this.viewIncomeInfoObj.ReservedFundAllocatedAmount;
  }

  updateRemainingAllocFromReservedFund(ev: number) {
    this.viewIncomeInfoObj.ReservedFundAllocatedAmount = ev;
    this.viewIncomeInfoObj.RemainingAllocatedAmount = this.viewIncomeInfoObj.MaxAllocatedAmount - this.viewIncomeInfoObj.ExpenseAmount - this.viewIncomeInfoObj.ReservedFundAllocatedAmount;
  }

  CekRemaining() {
    this.viewIncomeInfoObj.ExpenseAmount = this.tempTotalExpenseAmt;
    this.viewIncomeInfoObj.ReservedFundAllocatedAmount = this.tempTotalRsvFundAmt;
    this.viewIncomeInfoObj.RemainingAllocatedAmount = this.viewIncomeInfoObj.MaxAllocatedAmount - this.viewIncomeInfoObj.ExpenseAmount - this.viewIncomeInfoObj.ReservedFundAllocatedAmount;
  }

  isShow: boolean = false;
  DictRemainingIncomeForm: any = {};
  GetDictRemaining(ev){
    console.log(ev);
    this.DictRemainingIncomeForm = ev;
    this.isShow = true;
  }
}
