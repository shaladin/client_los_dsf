import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NGXToastrService} from 'app/components/extra/toastr/toastr.service';
import Stepper from 'bs-stepper';
import {AppObj} from 'app/shared/model/App/App.Model';
import {CommonConstant} from 'app/shared/constant/CommonConstant';
import {URLConstant} from 'app/shared/constant/URLConstant';
import {AdInsHelper} from 'app/shared/AdInsHelper';
import {NavigationConstant} from 'app/shared/constant/NavigationConstant';
import {CookieService} from 'ngx-cookie';
import {ClaimTaskService} from 'app/shared/claimTask.service';
import {environment} from 'environments/environment';
import {ReturnHandlingHObj} from 'app/shared/model/return-handling/return-handling-h-obj.model';
import {AllAppReservedFundObj} from 'app/shared/model/all-app-reserved-fund-obj.model';
import {ResReturnHandlingDObj} from 'app/shared/model/response/return-handling/res-return-handling-d-obj.model';
import {ResultRefundObj} from 'app/shared/model/app-fin-data/result-refund.model';
import {AppFinDataObj} from 'app/shared/model/app-fin-data/app-fin-data.model';
import {GenericObj} from 'app/shared/model/generic/generic-obj.model';
import {ReturnHandlingDObj} from 'app/shared/model/return-handling/return-handling-d-obj.model';
import {URLConstantX} from 'app/impl/shared/constant/URLConstantX';
import {ExceptionConstantX} from 'app/impl/shared/constant/ExceptionConstantX';
import {ResAppCommIncomeObjX} from 'app/impl/shared/model/AppFinData/ResAppCommIncomeObjX.Model';

@Component({
  selector: 'app-edit-comm-after-approval-detail-x',
  templateUrl: './edit-comm-after-approval-detail-x.component.html',
  providers: [NGXToastrService]
})
export class EditCommAfterApprovalDetailXComponent implements OnInit {
  AppId: number;
  AgrmntId:number;
  BizTemplateCode: string;
  IsViewReady = false;
  isReady = false;
  isShow: boolean = false;

  OnFormReturnInfo: boolean = false;
  lockCommissionTab: boolean = false;
  isRefundNotDouble: boolean = true;

  MaxAllocatedAmount = 0;

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

  ListResultRefundIncomeInfo: Array<ResultRefundObj>;
  TotalHalfListResultRefundIncomeInfo: number = 0;
  DictMaxIncomeForm: object = {};
  isView: boolean = false;

  constructor(
    private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private claimTaskService: ClaimTaskService, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
      }
      if (params['AgrmntId'] != null) {
        this.AgrmntId = params['AgrmntId'];
      }
      this.IsViewReady = true;
    });
  }

  async ngOnInit() {
    this.isShow = false;

    this.GetAndUpdateAppStep();
    await this.GetIncomeInfoObj();
  }

  async GetIncomeInfoObj() {
    await this.http.post<AppFinDataObj>(URLConstantX.GetAppFinDataWithRuleByAppIdX, {Id: this.AppId}).toPromise().then(
      (response) => {
        if (response.CommissionAllocatedAmt > 0) {
          response.CommissionAllocatedAmt = 0;
        }
        this.ListResultRefundIncomeInfo = response.ResultRefundRsvFundObjs;
        this.TotalHalfListResultRefundIncomeInfo = Math.floor(this.ListResultRefundIncomeInfo.length / 2);
        let totalListResultRefundIncomeInfoAmount = 0;
        let dupe = '';
        for (var i = 0; i < this.ListResultRefundIncomeInfo.length; i++) {
          let x = this.ListResultRefundIncomeInfo.filter(x => x.RefundAllocationFrom == this.ListResultRefundIncomeInfo[i].RefundAllocationFrom);
          if (x.length > 1) {
            this.isRefundNotDouble = false;
            dupe = this.ListResultRefundIncomeInfo[i].RefundAllocationFromDesc;
          }
          this.DictMaxIncomeForm[this.ListResultRefundIncomeInfo[i].RefundAllocationFrom] = this.ListResultRefundIncomeInfo[i];
          if (this.ListResultRefundIncomeInfo[i].RefundAmount < 0) {
            this.DictMaxIncomeForm[this.ListResultRefundIncomeInfo[i].RefundAllocationFrom].RefundAmount = 0;
          }
          totalListResultRefundIncomeInfoAmount += this.DictMaxIncomeForm[this.ListResultRefundIncomeInfo[i].RefundAllocationFrom].RefundAmount;
        }
        this.isView = true;
        this.viewIncomeInfoObj.MaxAllocatedAmount = totalListResultRefundIncomeInfoAmount;

        if (this.viewIncomeInfoObj.MaxAllocatedAmount < 0) {
          this.viewIncomeInfoObj.MaxAllocatedAmount = 0;
        }

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
        if (!this.isRefundNotDouble) {
          this.toastr.warningMessage('Refund ' + dupe + ' is Duplicated')
        }
      });
    this.isReady = true;
  }

  NapObj: AppObj = new AppObj();

  GetAndUpdateAppStep() {
    var appObj = {Id: this.AppId};
    this.http.post(URLConstant.GetAppById, appObj).subscribe(
      (response: AppObj) => {
        if (response) {
          this.NapObj = response;
        }
      });
  }

  tempTotalRsvFundAmt: number = 0;
  tempTotalExpenseAmt: number = 0;
  IsLastStep: boolean = false;

  LastStepHandler(ev) {
    if (ev.returnHandlingId == 0) {
      var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_PAGING], {'BizTemplateCode': lobCode});
    }
  }

  Back() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.EDIT_COMM_AFT_APV_PAGING], {'BizTemplateCode': this.BizTemplateCode});
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
}
