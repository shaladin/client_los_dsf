import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import Stepper from 'bs-stepper';
import { AppObj } from 'app/shared/model/App/App.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { environment } from 'environments/environment';
import { ReturnHandlingHObj } from 'app/shared/model/return-handling/return-handling-h-obj.model';
import { AllAppReservedFundObj } from 'app/shared/model/all-app-reserved-fund-obj.model';
import { ResReturnHandlingDObj } from 'app/shared/model/response/return-handling/res-return-handling-d-obj.model';
import { ResultRefundObj } from 'app/shared/model/app-fin-data/result-refund.model';
import { AppFinDataObj } from 'app/shared/model/app-fin-data/app-fin-data.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ReturnHandlingDObj } from 'app/shared/model/return-handling/return-handling-d-obj.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { ExceptionConstantX } from 'app/impl/shared/constant/ExceptionConstantX';

@Component({
  selector: 'app-comission-reserved-fund-detail-x',
  templateUrl: './comission-reserved-fund-detail-x.component.html',
  styleUrls: ['./comission-reserved-fund-detail-x.component.css'],
  providers: [NGXToastrService]
})
export class ComissionReservedFundDetailXComponent implements OnInit {

  ReturnHandlingHObj: ReturnHandlingHObj;
  AllAppReservedFundObj: AllAppReservedFundObj;
  StepIndex: number = 1;
  private stepper: Stepper;
  returnHandlingDObj: ResReturnHandlingDObj = new ResReturnHandlingDObj();
  showCancel: boolean = true;
  OnFormReturnInfo: boolean = false;
  BizTemplateCode: string;
  IsViewReady: boolean = false;
  isShow: boolean = false;
  lockCommissionTab: boolean = false;
  isRefundNotDouble: boolean = true;
  IsSave: boolean = false; 

  Step = {
    "RSV": 1,
    "COM": 2,
  };

  HandlingForm = this.fb.group({
    ReturnHandlingNotes: [''],
    ReturnHandlingExecNotes: [''],
  });

  constructor(
    private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private claimTaskService: ClaimTaskService, private toastr: NGXToastrService) {
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
      this.IsViewReady = true;
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
    Other: [],
    MaxAllocatedRefundAmt: 0
  };

  ngOnInit() {
    this.isShow = false;
    this.claimTask();

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
  DictMaxIncomeForm: object = {};
  isView: boolean = false;
  GetIncomeInfoObj() {
    var obj = {
      Id: this.ReturnHandlingHObj.AppId
    };
    this.http.post<AppFinDataObj>(URLConstantX.GetAppFinDataWithRuleByAppIdX, obj).subscribe(
      (response) => {
        if(response.CommissionAllocatedAmt>0){
          response.CommissionAllocatedAmt = 0;
        }
        this.ListResultRefundIncomeInfo = response.ResultRefundRsvFundObjs;
        this.TotalHalfListResultRefundIncomeInfo = Math.floor(this.ListResultRefundIncomeInfo.length / 2);
        let totalListResultRefundIncomeInfoAmount = 0;
        let dupe = "";
        for (var i = 0; i < this.ListResultRefundIncomeInfo.length; i++) {
          let x = this.ListResultRefundIncomeInfo.filter(x=>x.RefundAllocationFrom==this.ListResultRefundIncomeInfo[i].RefundAllocationFrom);
          if(x.length>1){
            this.isRefundNotDouble = false;
            dupe = this.ListResultRefundIncomeInfo[i].RefundAllocationFromDesc;
          }
          this.DictMaxIncomeForm[this.ListResultRefundIncomeInfo[i].RefundAllocationFrom] = this.ListResultRefundIncomeInfo[i];
          if (this.ListResultRefundIncomeInfo[i].RefundAmount < 0) this.DictMaxIncomeForm[this.ListResultRefundIncomeInfo[i].RefundAllocationFrom].RefundAmount = 0;
          totalListResultRefundIncomeInfoAmount += this.DictMaxIncomeForm[this.ListResultRefundIncomeInfo[i].RefundAllocationFrom].RefundAmount;
        }
        this.isView = true;
        this.viewIncomeInfoObj.MaxAllocatedAmount = totalListResultRefundIncomeInfoAmount;

        if (this.viewIncomeInfoObj.MaxAllocatedAmount < 0) this.viewIncomeInfoObj.MaxAllocatedAmount = 0;

        this.viewIncomeInfoObj.UppingRate = response.DiffRateAmt;
        this.viewIncomeInfoObj.InsuranceIncome = response.TotalInsCustAmt - response.TotalInsInscoAmt;
        this.viewIncomeInfoObj.LifeInsuranceIncome = response.TotalLifeInsCustAmt - response.TotalLifeInsInscoAmt;
        this.viewIncomeInfoObj.MaxAllocatedRefundAmt = response.MaxAllocatedRefundAmt,
        this.viewIncomeInfoObj.ReservedFundAllocatedAmount = response.ReservedFundAllocatedAmt;
        this.viewIncomeInfoObj.RemainingAllocatedAmount = this.viewIncomeInfoObj.MaxAllocatedAmount - response.CommissionAllocatedAmt - response.ReservedFundAllocatedAmt;
        this.viewIncomeInfoObj.InterestIncome = response.TotalInterestAmt;
        this.viewIncomeInfoObj.ExpenseAmount = response.CommissionAllocatedAmt;
        this.tempTotalRsvFundAmt = this.viewIncomeInfoObj.ReservedFundAllocatedAmount;
        this.tempTotalExpenseAmt = this.viewIncomeInfoObj.ExpenseAmount;
        if(!this.isRefundNotDouble){
          this.toastr.warningMessage("Refund "+dupe+" is Duplicated")
        }
      });
  }

  NapObj: AppObj = new AppObj();
  GetAndUpdateAppStep() {
    // this.NapObj.AppId = this.ReturnHandlingHObj.AppId;
    var appObj = { Id: this.ReturnHandlingHObj.AppId };
    this.http.post(URLConstant.GetAppById, appObj).subscribe(
      (response: AppObj) => {
        if (response) {
          this.NapObj = response;
          if (this.ReturnHandlingHObj.ReturnHandlingHId == 0) {
            if (this.NapObj.AppCurrStep != CommonConstant.AppStepComm && this.NapObj.AppCurrStep != CommonConstant.AppStepRSVFund) {
              this.NapObj.AppCurrStep = CommonConstant.AppStepComm;
              this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
                () => {
                  this.ChangeTab(CommonConstant.AppStepComm);
                }
              )
            }
          }
        }
      });
  }

  //DATA
  MakeViewReturnInfoObj() {
    if (this.ReturnHandlingHObj.ReturnHandlingHId > 0) {
      let ReqByIdAndCodeObj = new GenericObj();
      ReqByIdAndCodeObj.Id = this.ReturnHandlingHObj.ReturnHandlingHId;
      ReqByIdAndCodeObj.Code = CommonConstant.ReturnHandlingEditComRsvFnd;
      this.http.post(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, ReqByIdAndCodeObj).subscribe(
        (response: ResReturnHandlingDObj) => {
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
      case CommonConstant.AppStepRSVFund:
        this.StepIndex = 1;
        break;
      case CommonConstant.AppStepComm:
        this.StepIndex = 2;
        break;
      default:
        break;
    }

    if (AppStep == CommonConstant.AppStepComm)
      this.IsLastStep = true;
    else
      this.IsLastStep = false;
  }

  NextStep(Step) {
    if (this.ReturnHandlingHObj.ReturnHandlingHId > 0) {
      this.ChangeTab(Step);
      this.stepper.next();
    } else {
      this.NapObj.AppCurrStep = Step;
      console.log(this.NapObj);
      this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
        () => {
          this.tempTotalRsvFundAmt = this.viewIncomeInfoObj.ReservedFundAllocatedAmount;
          this.tempTotalExpenseAmt = this.viewIncomeInfoObj.ExpenseAmount;
          this.ChangeTab(Step);
          this.stepper.next();

        }
      )
    }
  }

  LastStepHandler(ev) {
    this.IsSave = ev.IsSave; 
    if (ev.returnHandlingId == 0) {
      var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_PAGING], { "BizTemplateCode": lobCode });
    }
  }

  //Submit
  SubmitReturnHandling() {
    if (this.ReturnHandlingHObj.ReturnHandlingHId > 0) {
      if (!this.IsSave) {
        this.toastr.warningMessage(ExceptionConstantX.PLEASE_CLICK_SAVE_FIRST);
        return;
      }
      else {
        var ReturnHandlingResult: ReturnHandlingDObj = new ReturnHandlingDObj();
        ReturnHandlingResult.WfTaskListId = this.ReturnHandlingHObj.WfTaskListId;
        ReturnHandlingResult.ReturnHandlingHId = this.returnHandlingDObj.ReturnHandlingHId;
        ReturnHandlingResult.ReturnHandlingDId = this.returnHandlingDObj.ReturnHandlingDId;
        ReturnHandlingResult.MrReturnTaskCode = this.returnHandlingDObj.MrReturnTaskCode;
        ReturnHandlingResult.ReturnStat = this.returnHandlingDObj.ReturnStat;
        ReturnHandlingResult.ReturnHandlingNotes = this.returnHandlingDObj.ReturnHandlingNotes;
        ReturnHandlingResult.ReturnHandlingExecNotes = this.HandlingForm.controls['ReturnHandlingExecNotes'].value;
        ReturnHandlingResult.RowVersion = this.returnHandlingDObj.RowVersion;
  
        let EditReturnHandlingDUrl = environment.isCore ? URLConstant.EditReturnHandlingDV2 : URLConstant.EditReturnHandlingD;
        this.http.post(EditReturnHandlingDUrl, ReturnHandlingResult).subscribe(
          () => {
            var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COMM_RSV_FUND_PAGING], { "BizTemplateCode": lobCode });
          })
      }
    }
  }

  Back() {
    var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    if (this.ReturnHandlingHObj.ReturnHandlingHId != 0) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COMM_RSV_FUND_PAGING], { "BizTemplateCode": lobCode });
    } else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_PAGING], { "BizTemplateCode": lobCode });
    }
  }

  updateRemainingAllocFromCommission(ev) {
    this.viewIncomeInfoObj.ExpenseAmount = ev.ExpenseAmount;
    this.viewIncomeInfoObj.RemainingAllocatedAmount = this.viewIncomeInfoObj.MaxAllocatedAmount - ev.TotalAllocAmt - this.viewIncomeInfoObj.ReservedFundAllocatedAmount;
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

  DictRemainingIncomeForm: object = {};
  GetDictRemaining(ev) {
    this.DictRemainingIncomeForm = ev;
    this.isShow = true;
  }

  checkCommData(ev: boolean) {
    this.lockCommissionTab = ev;
    console.log(this.lockCommissionTab)
  }

  claimTask() {
    if (environment.isCore) {
      if (this.ReturnHandlingHObj.WfTaskListId != "" && this.ReturnHandlingHObj.WfTaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.ReturnHandlingHObj.WfTaskListId);
      }
    }
    else if (this.ReturnHandlingHObj.WfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.ReturnHandlingHObj.WfTaskListId);
    }
  }
}
