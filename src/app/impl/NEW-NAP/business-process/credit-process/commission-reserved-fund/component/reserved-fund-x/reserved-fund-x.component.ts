import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AllAppReservedFundXObj } from 'app/impl/shared/model/AllAppReservedFundXObj.model';
import { AppReservedFundXObj } from 'app/impl/shared/model/AppReservedFundXObj.model';
import { ReqAppReservedFundXObj } from 'app/impl/shared/model/ReqAppReservedFundXObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCommissionHObj } from 'app/shared/model/AppCommissionHObj.Model';
import { AppFeeObj } from 'app/shared/model/AppFeeObj.Model';
import { ResultRefundObj } from 'app/shared/model/AppFinData/ResultRefund.Model';
import { AppReservedFundObj } from 'app/shared/model/AppReservedFundObj.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-reserved-fund-x',
  templateUrl: './reserved-fund-x.component.html',
  styleUrls: ['./reserved-fund-x.component.css']
})
export class ReservedFundXComponent implements OnInit {

  RsvForm = this.fb.group({
    ReservedFundObjs: this.fb.array([])
  });

  @Input() AppId:number=0;;
  @Input() showCancel: boolean = true;
  @Input() maxAllocAmt: number = 0;
  @Input() totalExpenseAmt: number = 0;
  @Input() totalRsvFundAmt: number = 0;
  @Input() DictMaxIncomeForm: object = {};
  @Input() ListResultRefundIncomeInfo: Array<ResultRefundObj>;
  // @Output() outputTab: EventEmitter<AllAppReservedFundXObj> = new EventEmitter();
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputDictRemaining: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  @Output() outputUpdateRemainingAlloc: EventEmitter<number> = new EventEmitter();
  @Output() outputCommCondition:EventEmitter<boolean> = new EventEmitter();

  appReservedFundObjs: Array<AppReservedFundXObj>;
  allAppReservedFundObj: AllAppReservedFundXObj = new AllAppReservedFundXObj();
  isCalculated: boolean = false;
  appFeeObj: Array<AppFeeObj>;
  ruleObj: any;
  calcGrossYieldObj: any;
  remainingAllocatedAmt: number;
  totalRsvFundAmtWhenSave: number;
  grossYield: number;
  show: boolean = false;
  maxAllocatedRefundAmt: number = 0;
  DictRemainingIncomeForm: object = {};
  lockAppCommTab: boolean=false;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private cookieService: CookieService) 
  {

  }

  async ngOnInit() {
    this.allAppReservedFundObj = new AllAppReservedFundXObj();
    var appObj = {
      Id: this.AppId
    };
    await this.GetAppCommissionData(appObj);
    this.checkAppRsvFundExisting(appObj);
    await this.GetAppRsvFundRule(appObj);
  }

  //GET
  async GetAppCommissionData(appObj) {
    for (let index = 0; index < this.ListResultRefundIncomeInfo.length; index++) {
      const element = this.ListResultRefundIncomeInfo[index];
      let TempObj = new ResultRefundObj();
      TempObj.RefundAllocationFrom = element.RefundAllocationFrom;
      TempObj.RefundAllocationFromDesc = element.RefundAllocationFromDesc;
      TempObj.RefundAmount = element.RefundAmount;
      this.DictRemainingIncomeForm[element.RefundAllocationFrom] = TempObj;
    }
    await this.http.post(URLConstant.GetAppCommissionDataForEditByAppId, appObj).toPromise().then(
      (response) => {
        let tempObj: Array<AppCommissionHObj> = response[CommonConstant.ReturnObj];
        for (let index = 0; index < tempObj.length; index++) {
          const element = tempObj[index];
          for (let index2 = 0; index2 < element.AppCommissionDs.length; index2++) {
            const element2 = element.AppCommissionDs[index2];
            if(this.DictRemainingIncomeForm[element2.MrCommissionSourceCode]){
              this.DictRemainingIncomeForm[element2.MrCommissionSourceCode].RefundAmount-=element2.CommissionAmt;
            }
          }
        }
        this.outputUpdateRemainingAlloc.emit(0);
        this.outputDictRemaining.emit(this.DictRemainingIncomeForm);
      }
    );
  }

  checkAppRsvFundExisting(appObj)
  {
    this.http.post(URLConstant.GetListAppReservedFundByAppId, appObj).toPromise().then(
      (response)=>{
        let tempObj: Array<AppReservedFundObj> = response[CommonConstant.ReturnObj];
        if(tempObj.length == 0)
        {
          this.lockAppCommTab = true;
        }
        this.outputCommCondition.emit(this.lockAppCommTab);
      }
    )
  }

  async GetAppRsvFundRule(appObj) {
    await this.http.post(URLConstantX.GetRsvFundSingleRule, appObj).toPromise().then(
      (response) => {
        this.ruleObj = response[CommonConstant.ReturnObj];
        this.appReservedFundObjs = new Array<AppReservedFundXObj>();
        for (let i = 0; i < this.ruleObj.length; i++) {
          var appReservedFundObj = new AppReservedFundXObj();
          appReservedFundObj.AppId = this.AppId;
          appReservedFundObj.MrReservedFundSourceCode = this.ruleObj[i].AllocationFrom;
          appReservedFundObj.MrReservedFundCode = this.ruleObj[i].AllocationTo;
          appReservedFundObj.ReservedFundAmt = this.ruleObj[i].AllocationAmount;
          appReservedFundObj.Behaviour = this.ruleObj[i].AllocationBehaviour;
          this.appReservedFundObjs.push(appReservedFundObj);
        }

        for (let j = 0; j < this.appReservedFundObjs.length; j++) {
          var listAppRsvFunds = this.RsvForm.controls["ReservedFundObjs"] as FormArray;
          listAppRsvFunds.push(this.addGroup(this.appReservedFundObjs[j], j));
        }
      }
    );
  }

  addGroup(appReservedFundObjs, i) {
    return this.fb.group({
      No: [i],
      MrReservedFundSourceCode: [appReservedFundObjs.MrReservedFundSourceCode],
      MrReservedFundCode: [appReservedFundObjs.MrReservedFundCode],
      ReservedFundAmt: [appReservedFundObjs.ReservedFundAmt, [Validators.required]],
      Behaviour: [appReservedFundObjs.Behaviour]
    })
  }

  //CALCULATE
  async calculated() {
    this.totalRsvFundAmt = 0;
    for (let i = 0; i < this.RsvForm.controls["ReservedFundObjs"].value.length; i++) {
      var temp: number = +this.RsvForm.controls["ReservedFundObjs"].value[i].ReservedFundAmt;
      this.totalRsvFundAmt = this.totalRsvFundAmt + temp;
    }
    var grossyieldObj = {
      AppId: this.AppId,
      TotalReserveFundAmt: this.totalRsvFundAmt
    };
    await this.http.post(URLConstantX.CalculateGrossYieldRsvFundX, grossyieldObj).toPromise().then(
      (response) => {
        this.calcGrossYieldObj = response;
        this.grossYield = this.calcGrossYieldObj.GrossYieldPrcnt;

      }
    );
    this.calculatedRemainingAmt();
    await this.setAppRsvFundData();
    this.isCalculated = true;
  }

  calculatedRemainingAmt() {
    this.remainingAllocatedAmt = this.maxAllocAmt - this.totalExpenseAmt - this.totalRsvFundAmt;
    if (0 > this.remainingAllocatedAmt) return this.toastr.warningMessage(ExceptionConstant.TOTAL_RESERVED_FUND_AMOUNT_MUST_LEST_THAN + "Remaining Allocated Amount");
    this.outputUpdateRemainingAlloc.emit(this.totalRsvFundAmt);
  }

  DictTempRemainingIncomeForm: Object = {}
  async setAppRsvFundData()
  {
    let listPriority: Array<string> = new Array();
    await this.http.post(URLConstantX.GetAppRsvFundPriorityRule, {Id: this.AppId}).toPromise().then(
      (response) => {
        listPriority = response["ListPrioritySupplier"];
      }
    );
    this.allAppReservedFundObj.GrossYield = this.grossYield;
    this.allAppReservedFundObj.TotalReservedFundAmt = this.totalRsvFundAmt;
    this.allAppReservedFundObj.RequestAppReservedFundObjs = new Array<ReqAppReservedFundXObj>();

    this.DictTempRemainingIncomeForm = new Object();
    for(let j=0;j<listPriority.length;j++)
    {
      let TempObj = new ResultRefundObj();
      TempObj.RefundAllocationFrom = this.DictRemainingIncomeForm[listPriority[j]].RefundAllocationFrom;
      TempObj.RefundAllocationFromDesc = this.DictRemainingIncomeForm[listPriority[j]].RefundAllocationFromDesc;
      TempObj.RefundAmount = this.DictRemainingIncomeForm[listPriority[j]].RefundAmount;
      this.DictTempRemainingIncomeForm[listPriority[j]] = TempObj;
    }

    for (let i=0; i<this.RsvForm.controls["ReservedFundObjs"].value.length; i++) 
    {
      var rsvAmt = this.RsvForm.controls["ReservedFundObjs"].value[i].ReservedFundAmt;
      for(let j=0;j<listPriority.length;j++)
      {
        if(rsvAmt == 0)break;

        if(this.DictTempRemainingIncomeForm[listPriority[j]].RefundAmount > 0)
        {
          if(this.DictTempRemainingIncomeForm[listPriority[j]].RefundAmount < rsvAmt)
          {
            var appRsvFundObj = new ReqAppReservedFundXObj();
            rsvAmt = rsvAmt - this.DictTempRemainingIncomeForm[listPriority[j]].RefundAmount;

            appRsvFundObj.AppId = this.AppId;
            appRsvFundObj.MrReservedFundSourceCode = listPriority[j];
            appRsvFundObj.MrReservedFundCode = this.RsvForm.controls["ReservedFundObjs"].value[i].MrReservedFundCode;
            appRsvFundObj.ReservedFundAmt = this.DictTempRemainingIncomeForm[listPriority[j]].RefundAmount;
            appRsvFundObj.StdReservedFundAmt = this.DictTempRemainingIncomeForm[listPriority[j]].RefundAmount;
            appRsvFundObj.Behaviour = this.RsvForm.controls["ReservedFundObjs"].value[i].Behaviour;
            if(this.DictMaxIncomeForm[listPriority[j]] != undefined){
              appRsvFundObj.RefundAmt = this.DictMaxIncomeForm[appRsvFundObj.MrReservedFundSourceCode].RefundAmount;
            }else{
              appRsvFundObj.RefundAmt = 0;
            }
            this.allAppReservedFundObj.RequestAppReservedFundObjs.push(appRsvFundObj);
            this.DictTempRemainingIncomeForm[listPriority[j]].RefundAmount = 0;
          }
          else if(this.DictTempRemainingIncomeForm[listPriority[j]].RefundAmount >= rsvAmt)
          {
            var appRsvFundObj = new ReqAppReservedFundXObj();
            this.DictTempRemainingIncomeForm[listPriority[j]].RefundAmount = this.DictTempRemainingIncomeForm[listPriority[j]].RefundAmount - rsvAmt

            appRsvFundObj.AppId = this.AppId;
            appRsvFundObj.MrReservedFundSourceCode = listPriority[j];
            appRsvFundObj.MrReservedFundCode = this.RsvForm.controls["ReservedFundObjs"].value[i].MrReservedFundCode;
            appRsvFundObj.ReservedFundAmt = rsvAmt;
            appRsvFundObj.StdReservedFundAmt = rsvAmt;
            appRsvFundObj.Behaviour = this.RsvForm.controls["ReservedFundObjs"].value[i].Behaviour;
            if(this.DictMaxIncomeForm[listPriority[j]] != undefined){
              appRsvFundObj.RefundAmt = this.DictMaxIncomeForm[appRsvFundObj.MrReservedFundSourceCode].RefundAmount;
            }else{
              appRsvFundObj.RefundAmt = 0;
            }
            this.allAppReservedFundObj.RequestAppReservedFundObjs.push(appRsvFundObj);
            rsvAmt = 0;
            break;
          }
        }
      }
    }
  }

  //Save
  SaveForm() {
    if (this.isCalculated == false) {
      this.toastr.warningMessage(ExceptionConstant.PLEASE_CALCULATE_FIRST);
    }
    else {
      this.calculating()
      if (this.totalRsvFundAmtWhenSave != this.totalRsvFundAmt)
      {
        this.toastr.warningMessage(ExceptionConstant.PLEASE_CALCULATE_AGAIN);
      }
      else if (this.remainingAllocatedAmt < 0) {
        this.toastr.warningMessage(ExceptionConstant.TOTAL_RESERVED_FUND_AMOUNT_MUST_LEST_THAN + "Remaining Allocated Amount");
      }
      else if (this.maxAllocAmt < this.totalRsvFundAmt) {
        this.toastr.warningMessage(ExceptionConstant.TOTAL_RESERVED_FUND_AMOUNT_MUST_LEST_THAN + "Max Allocated Amount");
      }
      else {
        this.http.post(URLConstantX.AddAppReservedFund, this.allAppReservedFundObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.lockAppCommTab = false;
            this.outputCommCondition.emit(this.lockAppCommTab);
            this.outputTab.emit();
          }
        );
      }
    }
  }

  calculating() {
    this.totalRsvFundAmtWhenSave = 0;
    for (let i = 0; i < this.RsvForm.controls["ReservedFundObjs"].value.length; i++) {
      var temp: number = +this.RsvForm.controls["ReservedFundObjs"].value[i].ReservedFundAmt;
      this.totalRsvFundAmtWhenSave = this.totalRsvFundAmtWhenSave + temp;
    }
  }

  Cancel(){
    this.outputCancel.emit();
  }

}
