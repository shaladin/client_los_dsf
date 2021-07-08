import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { AppAssetFinancialDataObj } from 'app/shared/model/AppAssetFinancialData,Model';
import { OutputCalcFinancialCofObj } from 'app/shared/model/OutputCalcFinancialCof.Model';
import { OutputCalcFinancialOplObj } from 'app/shared/model/OutputCalcFinancialOpl.Model';
import { ResAssetFinancialRuleObj } from 'app/shared/model/ResAssetFinancialRule.Model';

@Component({
  selector: 'app-fin-data-opl-detail',
  templateUrl: './financial-data-opl-detail.component.html',
})
export class FinancialDataOplEditComponent implements OnInit {
  @Input() AppAssetId: number;
  @Input() AppId: number;
  @Output() OutputGoPaging = new EventEmitter();

  FinancialDataForm = this.fb.group({
    SecurityDepositAmt: [0, Validators.required],
    ResidualType: [''],
    ResidualValuePrcnt: [0, Validators.required],
    ResidualValueAmt: [0, Validators.required],
    TotalInsuranceAtCostAmt: [0, Validators.required],
    TotalMaintenanceAtCostAmt: [0, Validators.required],
    TotalFeeAmt: [0, Validators.required],
    TotalFeeCapitalizedAmt: [0, Validators.required],
    TotalOthExpenseAmt: [0, Validators.required],
    CofAmt: [0, Validators.required],
    CofPrcnt: [0, Validators.required],
    CofPrincipal: [0],
    TotalOperatingCostAmt: [0, Validators.required],
    OperatingType: [''],
    OperatingMarginPrcnt: [0, Validators.required],
    OperatingMarginAmt: [0, Validators.required],
    RentAmt: [0, Validators.required],
    VatAmt: [0, Validators.required],
    GrossYieldPrcnt: [0, Validators.required],
    RentalPeriod: [0],
    RentalPeriodCode: [''],
    RentalPeriodName: [''],
    TotalAssetPrice: [0],
    DepreciationAmt: [0, Validators.required],
    DiscAmt: [0],

    AssetPriceAmt: [0],
    TotalAccessoriesPriceAmt: [0],
    PayFreqCode: [''],
    MrPayFreqTypeCode: [''],
    PayFreqVal: [0],
    TotalRentAmt: [0],

    RoundingAmt: [0],
    InterestPrnct: [0],
    InterestAmt: [0],
    TotalCostAfterMarginAmt: [0],
    RentAmtFullTenor: [0],
    VatAmtFullTenor: [0],
    RentAfterVatAmtFullTenor: [0],
    CustomerPaidAtCostAmt: [0]
  });

  isReady: boolean = false;
  isCalculate: boolean = false;
  isCalculateCof: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private toastr: NGXToastrService) { }

  async ngOnInit(): Promise<void> {
    this.getAllRefMaster();
    await this.getAssetFinDataRule();
    await this.getAssetFinData();
    //this.FinancialDataForm.controls["SecurityDepositAmt"].disable();
    this.FinancialDataForm.patchValue({
      ResidualValueAmt: (this.FinancialDataForm.controls.TotalAssetPrice.value + this.FinancialDataForm.controls.DiscAmt.value) * this.FinancialDataForm.controls.ResidualValuePrcnt.value / 100
    });
    this.allCalculate();
  }

  AppFinDataObj: AppAssetFinancialDataObj;
  async getAssetFinData() {
    var appAssetObj = {
      Id: this.AppAssetId,
    };
    await this.http.post(URLConstant.GetAppFinDataOplByAppAssetId, appAssetObj).toPromise().then(
      (response: AppAssetFinancialDataObj) => {
        this.AppFinDataObj = response;
        this.FinancialDataForm.patchValue({
          SecurityDepositAmt: this.AppFinDataObj.AppAssetRentDataOplObj.SecurityDepositAmt,
          ResidualValueAmt: this.AppFinDataObj.AppAssetRentDataOplObj.ResidualValueAmt,
          TotalInsuranceAtCostAmt: this.AppFinDataObj.AppAssetRentDataOplObj.TotalInsuranceAmt,
          TotalMaintenanceAtCostAmt: this.AppFinDataObj.AppAssetRentDataOplObj.TotalMaintAmt,
          TotalFeeAmt: this.AppFinDataObj.AppAssetRentDataOplObj.TotalFeeAmt,
          TotalFeeCapitalizedAmt: this.AppFinDataObj.AppAssetRentDataOplObj.TotalFeeCapitalized,
          TotalOthExpenseAmt: this.AppFinDataObj.AppAssetRentDataOplObj.TotalOthExpenseAmt,
          TotalOperatingCostAmt: this.AppFinDataObj.AppAssetRentDataOplObj.TotalCostAmt,
          OperatingMarginAmt: this.AppFinDataObj.AppAssetRentDataOplObj.MarginAmt,
          RentAmt: this.AppFinDataObj.AppAssetRentDataOplObj.RentAmt - this.AppFinDataObj.AppAssetRentDataOplObj.VatAmt,
          VatAmt: this.AppFinDataObj.AppAssetRentDataOplObj.VatAmt,
          GrossYieldPrcnt: this.AppFinDataObj.AppAssetRentDataOplObj.GrossYieldPrcnt,
          RentalPeriod: this.AppFinDataObj.Tenor,
          RentalPeriodCode: this.AppFinDataObj.MrFirstInstTypeCode,
          RentalPeriodName: this.AppFinDataObj.MrFirstInstTypeName,
          TotalAssetPrice: this.AppFinDataObj.TotalAssetPriceAmt,
          DepreciationAmt: this.AppFinDataObj.TotalAssetPriceAmt - this.AppFinDataObj.AppAssetRentDataOplObj.ResidualValueAmt,
          AssetPriceAmt: this.AppFinDataObj.AssetPriceAmt,
          TotalAccessoriesPriceAmt: this.AppFinDataObj.TotalAccessoriesPriceAmt,
          PayFreqCode: this.AppFinDataObj.PayFreqCode,
          PayFreqVal: this.AppFinDataObj.PayFreqVal,
          MrPayFreqTypeCode: this.AppFinDataObj.MrPayFreqTypeCode,
          DiscAmt: this.AppFinDataObj.DiscAmt
        });

        if (this.AppFinDataObj.AppAssetRentDataOplObj.IsDataExist) {
          this.FinancialDataForm.patchValue({
            ResidualValuePrcnt: this.AppFinDataObj.AppAssetRentDataOplObj.ResidualValuePrcnt,
            OperatingMarginPrcnt: this.AppFinDataObj.AppAssetRentDataOplObj.MarginPrcnt,
            CofPrcnt: this.AppFinDataObj.AppAssetRentDataOplObj.CofInterestPrnct,
            CofAmt: this.AppFinDataObj.AppAssetRentDataOplObj.CofInterestAmt
          });
        }
        this.isReady = true;
      });
  }

  AppFinDataRuleObj: ResAssetFinancialRuleObj;
  async getAssetFinDataRule() {
    var appAssetObj = {
      Id: this.AppAssetId,
    };
    await this.http.post(URLConstant.GetFinancialRuleOpl, appAssetObj).toPromise().then(
      (response: ResAssetFinancialRuleObj) => {
        this.AppFinDataRuleObj = response;
        this.FinancialDataForm.patchValue({
          ResidualValuePrcnt: this.AppFinDataRuleObj.ResultResidualValueRule.ResidualValuePrcnt,
          CofPrcnt: this.AppFinDataRuleObj.ResultFinancialOplRule.FlatInterestRate,
          OperatingMarginPrcnt: this.AppFinDataRuleObj.ResultFinancialOplRule.MarginRate,
          OperatingType: CommonConstant.InterestInputTypePrcnt,
          CofPrincipal: this.AppFinDataRuleObj.CofPrincipalObj.CofPrincipalAmt
        });
        this.ChangeOperatingType();
        if (this.AppFinDataRuleObj.ResultFinancialOplRule.MarginRateBhv == CommonConstant.BehaviourTypeLock) {
          this.FinancialDataForm.controls["OperatingMarginPrcnt"].disable();
          this.FinancialDataForm.controls["OperatingType"].disable();
          this.FinancialDataForm.controls["OperatingMarginAmt"].disable();
        }
      });
  }

  //Calculation
  allCalculate() {
    this.calculateDepresiasi();
    this.calculateOperatingCost();
    this.calculateCostAfterMargin();
    this.changeCalculate();
  }

  updateResiduAmt() {
    this.FinancialDataForm.patchValue({
      ResidualValueAmt: (this.FinancialDataForm.controls.TotalAssetPrice.value + this.FinancialDataForm.controls.DiscAmt.value) * this.FinancialDataForm.controls.ResidualValuePrcnt.value / 100
    });
    this.allCalculate();
  }

  updateInterestAmt() {
    //this.FinancialDataForm.patchValue({
    //  InterestAmt: (this.AppFinDataObj.RentalPeriod / 12) * this.AppFinDataObj.TotalAssetPriceAftrDiscAmt*this.FinancialDataForm.controls.InterestPrnct.value / 100
    //});
    this.allCalculate();
  }

  updateOperatingMarginAmt() {
    //this.FinancialDataForm.patchValue({
    //  OperatingMarginAmt: this.FinancialDataForm.controls.TotalOperatingCostAmt.value * this.FinancialDataForm.controls.OperatingMarginPrcnt.value / 100
    //});
    this.allCalculate();
  }

  updateResiduPrctg() {
    if (this.FinancialDataForm.controls.TotalAssetPrice.value + this.FinancialDataForm.controls.DiscAmt.value == 0) {
      this.FinancialDataForm.patchValue({
        ResidualValuePrcnt: 0
      });
    }
    else {
      this.FinancialDataForm.patchValue({
        ResidualValuePrcnt: this.FinancialDataForm.controls.ResidualValueAmt.value * 100 / (this.FinancialDataForm.controls.TotalAssetPrice.value + this.FinancialDataForm.controls.DiscAmt.value)
      });
    }
    this.allCalculate();
  }

  updateInterestPrctg() {
    //if (this.AppFinDataObj.TotalAssetPriceAftrDiscAmt == 0) {
    //  this.FinancialDataForm.patchValue({
    //    InterestPrnct: 0
    //  });
    //}
    //else {
    //  this.FinancialDataForm.patchValue({
    //    InterestPrnct: this.FinancialDataForm.controls.InterestAmt.value * 100 / ((this.AppFinDataObj.RentalPeriod / 12) * this.AppFinDataObj.TotalAssetPriceAftrDiscAmt)
    //  });
    //}
    this.allCalculate();
  }

  updateOperatingMarginPrctg() {
    //if (this.AppFinDataObj.TotalOperatingCostAmt  == 0) {
    //  this.FinancialDataForm.patchValue({
    //    OperatingMarginPrcnt: 0
    //  });
    //}
    //else {
    //  this.FinancialDataForm.patchValue({
    //    OperatingMarginPrcnt: this.FinancialDataForm.controls.OperatingMarginAmt.value * 100 / this.FinancialDataForm.controls.TotalOperatingCostAmt.value
    //  });
    //}
    this.allCalculate();
  }

  calculateDepresiasi() {
    this.FinancialDataForm.patchValue({
      DepreciationAmt: this.FinancialDataForm.controls.TotalAssetPrice.value - this.FinancialDataForm.controls.ResidualValueAmt.value
    });
  }

  calculateOperatingCost() {
    //this.FinancialDataForm.patchValue({
    //  TotalOperatingCostAmt: this.FinancialDataForm.controls.TotalFeeCapitalizedAmt.value + this.FinancialDataForm.controls.TotalInsuranceAtCostAmt.value + this.FinancialDataForm.controls.TotalMaintenanceAtCostAmt.value + this.FinancialDataForm.controls.TotalOthExpenseAmt.value + this.FinancialDataForm.controls.InterestAmt.value + this.FinancialDataForm.controls.DepreciationAmt.value
    //});
  }

  calculateCostAfterMargin() {
    //this.FinancialDataForm.patchValue({
    //  TotalCostAfterMarginAmt: this.FinancialDataForm.controls.TotalOperatingCostAmt.value + this.FinancialDataForm.controls.OperatingMarginAmt.value
    //});
  }

  CalculatedObj: OutputCalcFinancialOplObj;
  CalculateRental(isRental: boolean) {
    if (this.isCalculateCof == false) {
      this.toastr.warningMessage("Please Calculate COF First");
    }
    else {
      var cashFlow = new Array();
      this.CashFlowItemObj.forEach((o) => {
        var amt = {
          MrCashFlowItemCode: "",
          InitialAmt: 0
        };
        if (o.Key == CommonConstant.CashFlowItemMasterCodeFeeCptlz) {
          amt.InitialAmt = this.FinancialDataForm.controls.TotalFeeCapitalizedAmt.value;
          amt.MrCashFlowItemCode = CommonConstant.CashFlowItemMasterCodeFeeCptlz;
        }
        else if (o.Key == CommonConstant.CashFlowItemMasterCodeInstallment) {
          amt.InitialAmt = 0;
          amt.MrCashFlowItemCode = CommonConstant.CashFlowItemMasterCodeInstallment;
        }
        else if (o.Key == CommonConstant.CashFlowItemMasterCodeInsurance) {
          amt.InitialAmt = this.FinancialDataForm.controls.TotalInsuranceAtCostAmt.value;
          amt.MrCashFlowItemCode = CommonConstant.CashFlowItemMasterCodeInsurance;
        }
        else if (o.Key == CommonConstant.CashFlowItemMasterCodeMaint) {
          amt.InitialAmt = this.FinancialDataForm.controls.TotalMaintenanceAtCostAmt.value;
          amt.MrCashFlowItemCode = CommonConstant.CashFlowItemMasterCodeMaint;
        }
        else if (o.Key == CommonConstant.CashFlowItemMasterCodeReplaceCar) {
          var rc = this.AppFinDataObj.AppAssetOthExpenseOplObjs.find(f => f.MrOthExpenseTypeOplCode == CommonConstant.OtherExpenseMasterCodeExpRc);
          if (rc != null) {
            amt.InitialAmt = rc.OthExpenseAmt;
            amt.MrCashFlowItemCode = CommonConstant.CashFlowItemMasterCodeReplaceCar;
          }
        }
        else if (o.Key == CommonConstant.CashFlowItemMasterCodeStnk) {
          var stnk = this.AppFinDataObj.AppAssetOthExpenseOplObjs.find(f => f.MrOthExpenseTypeOplCode == CommonConstant.OtherExpenseMasterCodeExpStn);
          if (stnk != null) {
            amt.InitialAmt = stnk.OthExpenseAmt;
            amt.MrCashFlowItemCode = CommonConstant.CashFlowItemMasterCodeStnk;
          }
        }
        else if (o.Key == CommonConstant.CashFlowItemMasterCodeOdb) {
          var obd = this.AppFinDataObj.AppAssetOthExpenseOplObjs.find(f => f.MrOthExpenseTypeOplCode == CommonConstant.OtherExpenseMasterCodeExpOdb);
          if (obd != null) {
            amt.InitialAmt = obd.OthExpenseAmt;
            amt.MrCashFlowItemCode = CommonConstant.CashFlowItemMasterCodeOdb;
          }
        }
        cashFlow.push(amt);
      });
      if (isRental == true) {
        var CalculateRentalObj = {
          AccessoriesPriceAmt: this.FinancialDataForm.controls.TotalAccessoriesPriceAmt.value,
          InsuranceAmt: this.FinancialDataForm.controls.TotalInsuranceAtCostAmt.value,
          MaintenanceAmt: this.FinancialDataForm.controls.TotalMaintenanceAtCostAmt.value,
          OthExpenseAmt: this.FinancialDataForm.controls.TotalOthExpenseAmt.value,
          FeeAmt: this.FinancialDataForm.controls.TotalFeeAmt.value,
          FeeCapitalizedAmt: this.FinancialDataForm.controls.TotalFeeCapitalizedAmt.value,
          CofAmt: this.FinancialDataForm.controls.CofAmt.value,
          //CofAmt: this.FinancialDataForm.controls.CofPrcnt.value * (this.FinancialDataForm.controls.TotalAccessoriesPriceAmt.value + this.FinancialDataForm.controls.TotalInsuranceAtCostAmt.value + this.FinancialDataForm.controls.TotalMaintenanceAtCostAmt.value + this.FinancialDataForm.controls.TotalOthExpenseAmt.value + this.FinancialDataForm.controls.TotalFeeCapitalizedAmt.value),
          DepreciationAmt: this.FinancialDataForm.controls.DepreciationAmt.value,

          MarginType: this.FinancialDataForm.controls.OperatingType.value,
          MarginAmt: this.FinancialDataForm.controls.OperatingMarginAmt.value,
          MarginPrcnt: this.FinancialDataForm.controls.OperatingMarginPrcnt.value,
          RentalPeriod: this.FinancialDataForm.controls.RentalPeriod.value,
          PayFreqVal: this.FinancialDataForm.controls.PayFreqVal.value,
          PayFreqTypeCode: this.FinancialDataForm.controls.MrPayFreqTypeCode.value,
          IsCalculateRental: true,
          TotalAssetPriceAmt: this.FinancialDataForm.controls.TotalAssetPrice.value,
          RentalType: this.FinancialDataForm.controls.RentalPeriodCode.value,
          ResidualValueAmt: this.FinancialDataForm.controls.ResidualValueAmt.value,
          AppCashFlowItemObjs: cashFlow
        };
        this.http.post(URLConstant.CalculateFinancialOpl, CalculateRentalObj).subscribe(
          (response: OutputCalcFinancialOplObj) => {
            this.CalculatedObj = response;
            this.FinancialDataForm.patchValue({
              TotalOperatingCostAmt: this.CalculatedObj.TotalCost,
              OperatingMarginAmt: this.CalculatedObj.MarginAmt,
              OperatingMarginPrcnt: this.CalculatedObj.MarginPrcnt,
              RentAmt: this.CalculatedObj.RentAmt,
              TotalRentAmt: this.CalculatedObj.TotalRentAmt,
              GrossYieldPrcnt: this.CalculatedObj.GrossYieldPrcnt
            });
            if (this.FinancialDataForm.controls.RentalPeriodCode.value == CommonConstant.FirstInstTypeAdvance) {
              this.FinancialDataForm.patchValue({
                CustomerPaidAtCostAmt: this.CalculatedObj.RentAmt + this.FinancialDataForm.controls.TotalFeeAmt.value + this.FinancialDataForm.controls.SecurityDepositAmt.value
              });
            }
            else {
              this.FinancialDataForm.patchValue({
                CustomerPaidAtCostAmt: this.FinancialDataForm.controls.TotalFeeAmt.value + this.FinancialDataForm.controls.SecurityDepositAmt.value
              });
            }
          }
        );
      }
      else {
        if (this.FinancialDataForm.controls.RentAmt.value < 1) {
          this.toastr.warningMessage("Please Input Rental Amount More Than 0");
          return;
        }
        var CalculateObj = {
          AccessoriesPriceAmt: this.FinancialDataForm.controls.TotalAccessoriesPriceAmt.value,
          InsuranceAmt: this.FinancialDataForm.controls.TotalInsuranceAtCostAmt.value,
          MaintenanceAmt: this.FinancialDataForm.controls.TotalMaintenanceAtCostAmt.value,
          OthExpenseAmt: this.FinancialDataForm.controls.TotalOthExpenseAmt.value,
          FeeAmt: this.FinancialDataForm.controls.TotalFeeAmt.value,
          FeeCapitalizedAmt: this.FinancialDataForm.controls.TotalFeeCapitalizedAmt.value,
          CofAmt: this.FinancialDataForm.controls.CofAmt.value,
          //CofAmt: 500000,
          DepreciationAmt: this.FinancialDataForm.controls.DepreciationAmt.value,

          RentAmt: this.FinancialDataForm.controls.RentAmt.value,
          RentalPeriod: this.FinancialDataForm.controls.RentalPeriod.value,
          PayFreqVal: this.FinancialDataForm.controls.PayFreqVal.value,
          PayFreqTypeCode: this.FinancialDataForm.controls.MrPayFreqTypeCode.value,
          IsCalculateRental: false,
          TotalAssetPriceAmt: this.FinancialDataForm.controls.TotalAssetPrice.value,
          RentalType: this.FinancialDataForm.controls.RentalPeriodCode.value,
          ResidualValueAmt: this.FinancialDataForm.controls.ResidualValueAmt.value,
          AppCashFlowItemObjs: cashFlow
        };
        this.http.post(URLConstant.CalculateFinancialOpl, CalculateObj).subscribe(
          (response: OutputCalcFinancialOplObj) => {
            this.CalculatedObj = response;
            this.FinancialDataForm.patchValue({
              TotalOperatingCostAmt: this.CalculatedObj.TotalCost,
              OperatingMarginAmt: this.CalculatedObj.MarginAmt,
              OperatingMarginPrcnt: this.CalculatedObj.MarginPrcnt,
              RentAmt: this.CalculatedObj.RentAmt,
              TotalRentAmt: this.CalculatedObj.TotalRentAmt,
              GrossYieldPrcnt: this.CalculatedObj.GrossYieldPrcnt
            });
            if (this.FinancialDataForm.controls.RentalPeriodCode.value == CommonConstant.FirstInstTypeAdvance) {
              this.FinancialDataForm.patchValue({
                CustomerPaidAtCostAmt: this.CalculatedObj.RentAmt + this.FinancialDataForm.controls.TotalFeeAmt.value + this.FinancialDataForm.controls.SecurityDepositAmt.value
              });
            }
            else {
              this.FinancialDataForm.patchValue({
                CustomerPaidAtCostAmt: this.CalculatedObj.RentAmt
              });
            }
          }
        );
      }
      this.isCalculate = true;
    }
  }

  CalculatedCofObj: OutputCalcFinancialCofObj;
  CalculateCOF() {
    var CalculateRentalObj = {
      CofPrincipalAmt: this.FinancialDataForm.controls.CofPrincipal.value,
      CofPrcnt: this.FinancialDataForm.controls.CofPrcnt.value,
      RentalPeriod: this.FinancialDataForm.controls.RentalPeriod.value,
      PayFreqVal: this.FinancialDataForm.controls.PayFreqVal.value,
      PayFreqTypeCode: this.FinancialDataForm.controls.MrPayFreqTypeCode.value,
      RentalType: this.FinancialDataForm.controls.RentalPeriodCode.value,
      ResidualValueAmt: this.FinancialDataForm.controls.ResidualValueAmt.value
    };
    this.http.post(URLConstant.CalculateCOFOpl, CalculateRentalObj).subscribe(
      (response: OutputCalcFinancialCofObj) => {
        this.CalculatedCofObj = response;
        this.FinancialDataForm.patchValue({
          CofAmt: this.CalculatedCofObj.CofAmt
        });
        this.isCalculateCof = true;
      }
    );
  }

  //Get Ref Master
  refMasterObj = {
    RefMasterTypeCode: "",
  };
  getAllRefMaster() {
    this.getRefMasterResidualType();
    this.getRefMasterOperatingMarginType();
    this.getRefMasterCashFlowItem();
  }

  ResidualTypeObj: Array<KeyValueObj>;
  getRefMasterResidualType() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeResidualType;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.ResidualTypeObj = response[CommonConstant.ReturnObj];
        if (this.ResidualTypeObj.length > 0) {
          this.FinancialDataForm.patchValue({
            ResidualType: this.ResidualTypeObj[0].Key
          });
          this.ChangeResidualType();
        }
      }
    );
  }

  OperatingMarginObj: Array<KeyValueObj>;
  getRefMasterOperatingMarginType() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeOperatingMargin;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.OperatingMarginObj = response[CommonConstant.ReturnObj];
        if (this.OperatingMarginObj.length > 0) {
          this.FinancialDataForm.patchValue({
            OperatingType: this.OperatingMarginObj[0].Key
          });
          this.ChangeOperatingType();
        }
      }
    );
  }

  CashFlowItemObj: Array<KeyValueObj>;
  getRefMasterCashFlowItem() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCashflowItem;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.CashFlowItemObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  //Other
  ChangeResidualType() {
    if (this.FinancialDataForm.controls.ResidualType.value == CommonConstant.InterestInputTypeAmt) {
      this.FinancialDataForm.controls["ResidualValuePrcnt"].disable();
      this.FinancialDataForm.controls["ResidualValueAmt"].enable();
    }
    else if (this.FinancialDataForm.controls.ResidualType.value == CommonConstant.InterestInputTypePrcnt) {
      this.FinancialDataForm.controls["ResidualValueAmt"].disable();
      this.FinancialDataForm.controls["ResidualValuePrcnt"].enable();
    }
  }

  ChangeOperatingType() {
    if (this.FinancialDataForm.controls.OperatingType.value == CommonConstant.InterestInputTypeAmt) {
      this.FinancialDataForm.controls["OperatingMarginPrcnt"].disable();
      this.FinancialDataForm.controls["OperatingMarginAmt"].enable();
    }
    else if (this.FinancialDataForm.controls.OperatingType.value == CommonConstant.InterestInputTypePrcnt) {
      this.FinancialDataForm.controls["OperatingMarginAmt"].disable();
      this.FinancialDataForm.controls["OperatingMarginPrcnt"].enable();
    }
  }

  SaveForm(formDirective: FormGroupDirective) {
    if (this.isCalculateCof == false) {
      this.toastr.warningMessage("Please Calculate COF First");
    }
    else if (this.isCalculate == false) {
      this.toastr.warningMessage("Please Calculate Rental or Margin First");
    }
    else {
      var FinOplObj = this.setAssetFinData();
      this.http.post(URLConstant.AddEditFinDataOpl, FinOplObj).subscribe(
        (response) => {
          formDirective.resetForm();
          this.OutputGoPaging.emit();
          this.toastr.successMessage(response["message"]);
        }
      );
    }
  }

  Cancel() {
    this.OutputGoPaging.emit();
  }

  isFeeDupe: boolean = false;
  isExpenseDupe: boolean = false;
  setAssetFinData() {
    let vatAmt = this.FinancialDataForm.controls.RentAmt.value * 0.1;
    var RentData = {
      AppAssetId: this.AppAssetId,
      SecurityDepositAmt: this.FinancialDataForm.controls.SecurityDepositAmt.value,
      ResidualValuePrcnt: this.FinancialDataForm.controls.ResidualValuePrcnt.value,
      ResidualValueAmt: this.FinancialDataForm.controls.ResidualValueAmt.value,
      TotalMaintAmt: this.FinancialDataForm.controls.TotalMaintenanceAtCostAmt.value,
      TotalInsuranceAmt: this.FinancialDataForm.controls.TotalInsuranceAtCostAmt.value,
      TotalOthExpenseAmt: this.FinancialDataForm.controls.TotalOthExpenseAmt.value,
      TotalFeeAmt: this.FinancialDataForm.controls.TotalFeeAmt.value,
      TotalFeeCapitalized: this.FinancialDataForm.controls.TotalFeeCapitalizedAmt.value,
      CofInterestPrnct: this.FinancialDataForm.controls.CofPrcnt.value,
      CofInterestAmt: this.FinancialDataForm.controls.CofAmt.value,
      TotalCostAmt: this.FinancialDataForm.controls.TotalOperatingCostAmt.value,
      MarginPrcnt: this.FinancialDataForm.controls.OperatingMarginPrcnt.value,
      MarginAmt: this.FinancialDataForm.controls.OperatingMarginAmt.value,
      RentAmt: this.FinancialDataForm.controls.RentAmt.value + vatAmt,
      VatAmt: vatAmt,
      GrossYieldPrcnt: this.FinancialDataForm.controls.GrossYieldPrcnt.value
    };

    var RentSchdls = new Array();
    for (let i = 0; i < this.CalculatedCofObj.ListRentSchdlOpl.length; i++) {
      var rentSchdl = {
        AppAssetId: this.AppAssetId,
        SeqNo: this.CalculatedCofObj.ListRentSchdlOpl[i].SeqNo,
        RentAmt: this.FinancialDataForm.controls.RentAmt.value + vatAmt,
        RentAmtExclVat: this.FinancialDataForm.controls.RentAmt.value,
        VatAmt: vatAmt,
        WithholdingTaxAmt: 0,
        CostAmt: this.FinancialDataForm.controls.TotalOperatingCostAmt.value / this.FinancialDataForm.controls.RentalPeriod.value,
        MarginAmt: this.FinancialDataForm.controls.OperatingMarginAmt.value,
        CofPrincipal: this.CalculatedCofObj.ListRentSchdlOpl[i].CofPrincipalAmt,
        CofInterest: this.CalculatedCofObj.ListRentSchdlOpl[i].CofInterest,
      };
      RentSchdls.push(rentSchdl);
    }

    var FinOplObj = {
      AppAssetRentDataOplObj: RentData,
      AppAssetRentSchdlOplObjs: RentSchdls,
      AppCashFlowItemObjs: this.CalculatedObj.AppCashFlowItemObjs
    };
    return FinOplObj;
  }

  changeCalculate() {
    this.isCalculate = false;
    this.isCalculateCof = false;
  }

  resetCalculateRentalOrMargin() {
    this.isCalculate = false;
  }
}