import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { CalcRegularFixObj } from 'app/shared/model/AppFinData/CalcRegularFixObj.Model';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { formatDate } from '@angular/common';

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
    TotalOperatingCostAmt: [0, Validators.required],
    OperatingType: [''],
    OperatingMarginPrcnt: [0, Validators.required],
    OperatingMarginAmt: [0, Validators.required],
    RentAmt: [0, Validators.required],
    VatAmt: [0, Validators.required],
    GrossYieldPrcnt: [0, Validators.required],
    RentalPeriod: [0],
    RentalPeriodCode:[''],
    RentalPeriodName: [''],
    TotalAssetPrice: [0],
    DepreciationAmt: [0, Validators.required],

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
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getAllRefMaster();
    await this.getAssetFinData();
    this.FinancialDataForm.controls["SecurityDepositAmt"].disable();
  }
  AppFinDataObj: any;
  async getAssetFinData() {
    var appAssetObj = {
      AppAssetId: this.AppAssetId,
    };
    await this.http.post(URLConstant.GetAppFinDataOplByAppAssetId, appAssetObj).toPromise().then(
      (response) => {
        this.AppFinDataObj = response;
        this.FinancialDataForm.patchValue({
          SecurityDepositAmt: this.AppFinDataObj.AppAssetRentDataOplObj.SecurityDepositAmt,
          ResidualValuePrcnt: this.AppFinDataObj.AppAssetRentDataOplObj.ResidualValuePrcnt,
          ResidualValueAmt: this.AppFinDataObj.AppAssetRentDataOplObj.ResidualValueAmt,
          TotalInsuranceAtCostAmt: this.AppFinDataObj.AppAssetRentDataOplObj.TotalInsuranceAmt,
          TotalMaintenanceAtCostAmt: this.AppFinDataObj.AppAssetRentDataOplObj.TotalMaintAmt,
          TotalFeeAmt: this.AppFinDataObj.AppAssetRentDataOplObj.TotalFeeAmt,
          TotalFeeCapitalizedAmt: this.AppFinDataObj.AppAssetRentDataOplObj.TotalFeeCapitalized,
          TotalOthExpenseAmt: this.AppFinDataObj.AppAssetRentDataOplObj.TotalOthExpenseAmt,
          TotalOperatingCostAmt: this.AppFinDataObj.AppAssetRentDataOplObj.TotalCostAmt,
          OperatingMarginPrcnt: this.AppFinDataObj.AppAssetRentDataOplObj.MarginPrcnt,
          OperatingMarginAmt: this.AppFinDataObj.AppAssetRentDataOplObj.MarginAmt,
          RentAmt: this.AppFinDataObj.AppAssetRentDataOplObj.RentAmt,
          VatAmt: this.AppFinDataObj.AppAssetRentDataOplObj.VatAmt,
          GrossYieldPrcnt: this.AppFinDataObj.AppAssetRentDataOplObj.GrossYieldPrcnt,
          RentalPeriod: this.AppFinDataObj.Tenor,
          RentalPeriodCode: this.AppFinDataObj.MrFirstInstTypeCode,
          RentalPeriodName: this.AppFinDataObj.MrFirstInstTypeName,
          TotalAssetPrice: this.AppFinDataObj.TotalAssetPriceAmt,
          DepreciationAmt: 0
        });
        this.isReady = true;
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
    //this.FinancialDataForm.patchValue({
    //  ResidualValueAmt: this.AppFinDataObj.TotalAssetOtrPriceAmt * this.FinancialDataForm.controls.ResidualValuePrcnt.value / 100
    //});
    this.allCalculate();
    console.log("awaw");
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
    //if (this.AppFinDataObj.TotalAssetOtrPriceAmt == 0) {
    //  this.FinancialDataForm.patchValue({
    //    ResidualValuePrcnt: 0
    //  });
    //}
    //else {
    //  this.FinancialDataForm.patchValue({
    //    ResidualValuePrcnt: this.FinancialDataForm.controls.ResidualValueAmt.value * 100 / this.AppFinDataObj.TotalAssetOtrPriceAmt
    //  });
    //}
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
    //this.FinancialDataForm.patchValue({
    //  DepreciationAmt: this.AppFinDataObj.TotalAssetPriceAftrDiscAmt - this.FinancialDataForm.controls.ResidualValueAmt.value
    //});
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

  CalculatedObj: any;
  CalculateRental(isRental: boolean) {
    //var listFee = new Array();
    //for (let i = 0; i < this.FinancialDataForm.controls["AssetFeeOplObjs"].value.length; i++) {
    //  var newFee = {
    //    FeeAmt: this.FinancialDataForm.controls["AssetFeeOplObjs"].value[i].FeeAmt,
    //    CapitalizedAmt: this.FinancialDataForm.controls["AssetFeeOplObjs"].value[i].CapitalizedAmt
    //  };
    //  listFee.push(newFee);
    //}

    //var listExpense = new Array();
    //for (let i = 0; i < this.FinancialDataForm.controls["AssetExpenseOplObjs"].value.length; i++) {
    //  var newExpense = {
    //    ExpenseAmt: this.FinancialDataForm.controls["AssetExpenseOplObjs"].value[i].ExpenseAmt
    //  };
    //  listExpense.push(newExpense);
    //}

    //var CalculateObj = {
    //  RentalPeriod: this.AppFinDataObj.RentalPeriod,
    //  TotalCostAfterMarginAmt: this.FinancialDataForm.controls.TotalCostAfterMarginAmt.value,
    //  RoundingAmt: this.FinancialDataForm.controls.RoundingAmt.value,
      
    //  RentalType: this.AppFinDataObj.RentalType,
    //  TotalFeeAmt: this.FinancialDataForm.controls.TotalFeeAmt.value,
    //  TotalFeeCapitalizedAmt: this.FinancialDataForm.controls.TotalFeeCapitalizedAmt.value,

    //  ResidualValueAmt: this.FinancialDataForm.controls.ResidualValueAmt.value,
    //  TotalAssetPriceAftrDiscAmt: this.AppFinDataObj.TotalAssetPriceAftrDiscAmt,
    //  TotalInsuranceAtCostAmt: this.FinancialDataForm.controls.TotalInsuranceAtCostAmt.value,
    //  TotalMaintenanceAtCostAmt: this.FinancialDataForm.controls.TotalMaintenanceAtCostAmt.value,
    //  TotalExpenseAmt: this.FinancialDataForm.controls.TotalExpenseAmt.value,
    //  InterestAmt: this.FinancialDataForm.controls.InterestAmt.value,
    //  DepreciationAmt: this.FinancialDataForm.controls.DepreciationAmt.value,
    //  TotalOperatingCostAmt: this.FinancialDataForm.controls.TotalOperatingCostAmt.value,
    //  OperatingMarginAmt: this.FinancialDataForm.controls.OperatingMarginAmt.value,
    //  FeeObjs: listFee,
    //  ExpenseObjs: listExpense,

    //  MrPayFreqTypeCode: this.AppFinDataObj.MrPayFreqTypeCode,
    //  PayFreqVal: this.AppFinDataObj.PayFreqVal,
    //};
    this.FinancialDataForm.patchValue({
      RentAmt: 10000000,
      RentAmtFullTenor: 10000000,
      VatAmt: 10000000,
      VatAmtFullTenor: 10000000,
      RentAfterVatAmtFullTenor: 10000000,
      GrossYieldPrcnt: 10,
      CustomerPaidAtCost: 10000000,
      SecurityDepositAmt: 10000000,
      CustomerPaidAtCostAmt: 10000000

    });
    this.isCalculate = true;
    //this.http.post(URLConstant.CalculateFinancialOpl, CalculateObj).subscribe(
    //  (response) => {
    //    this.CalculatedObj = response;
    //    console.log(response);
    //    this.FinancialDataForm.patchValue({
    //      RentAmt: this.CalculatedObj.RentAmt,
    //      RentAmtFullTenor: this.CalculatedObj.RentAmtFullTenor,
    //      VatAmt: this.CalculatedObj.VatAmt,
    //      VatAmtFullTenor: this.CalculatedObj.VatAmtFullTenor,
    //      RentAfterVatAmt: this.CalculatedObj.RentAfterVatAmt,
    //      RentAfterVatAmtFullTenor: this.CalculatedObj.RentAfterVatAmtFullTenor,
    //      GrossYieldPrcnt: this.CalculatedObj.GrossYieldPrcnt,
    //      CustomerPaidAtCost: this.CalculatedObj.CustomerPaidAtCost,
    //      SecurityDepositAmt: this.CalculatedObj.SecurityDepositAmt,
    //      CustomerPaidAtCostAmt: this.CalculatedObj.CustomerPaidAtCost

    //    });
    //    this.isCalculate = true;
    //  }
    //);
  }
  //Get Ref Master
  refMasterObj = {
    RefMasterTypeCode: "",
  };
  getAllRefMaster() {
    this.getRefMasterResidualType();
    this.getRefMasterOperatingMarginType();
  }

  ResidualTypeObj: any;
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

  OperatingMarginObj: any;
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

  //Other
  ChangeResidualType() {
    if (this.FinancialDataForm.controls.ResidualType.value == "AMT") {
      this.FinancialDataForm.controls["ResidualValuePrcnt"].disable();
      this.FinancialDataForm.controls["ResidualValueAmt"].enable();
    }
    else if (this.FinancialDataForm.controls.ResidualType.value == "PRCNT") {
      this.FinancialDataForm.controls["ResidualValueAmt"].disable();
      this.FinancialDataForm.controls["ResidualValuePrcnt"].enable();
    }
  }
  ChangeOperatingType() {
    if (this.FinancialDataForm.controls.OperatingType.value == "AMT") {
      this.FinancialDataForm.controls["OperatingMarginPrcnt"].disable();
      this.FinancialDataForm.controls["OperatingMarginAmt"].enable();
    }
    else if (this.FinancialDataForm.controls.OperatingType.value == "PRCNT") {
      this.FinancialDataForm.controls["OperatingMarginAmt"].disable();
      this.FinancialDataForm.controls["OperatingMarginPrcnt"].enable();
    }
  }

  SaveForm(formDirective: FormGroupDirective) {
    var FinOplObj = this.setAssetFinData();
    if (this.isCalculate == false) {
      this.toastr.warningMessage("Please Calculate");
    }
    else {
      this.http.post(URLConstant.AddEditFinDataOpl, FinOplObj).subscribe(
        (response) => {
          formDirective.resetForm();
          this.OutputGoPaging.emit();
          this.toastr.successMessage("App Asset Rental Data Saved Successfully");
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
    //var listFee = new Array();
    //for (let i = 0; i < this.FinancialDataForm.controls["AssetFeeOplObjs"].value.length; i++) {
    //  var tempFee = this.FinancialDataForm.controls["AssetFeeOplObjs"].value.filter(
    //    fee => fee.FeeTypeOplCode == this.FinancialDataForm.controls["AssetFeeOplObjs"].value[i].FeeTypeOplCode
    //  );
    //  if (tempFee.length > 1) {
    //    this.isFeeDupe = true;
    //    break;
    //  }

    //  var newFee = {
    //    FeeTypeOplCode: this.FinancialDataForm.controls["AssetFeeOplObjs"].value[i].FeeTypeOplCode,
    //    FeeAmt: this.FinancialDataForm.controls["AssetFeeOplObjs"].value[i].FeeAmt,
    //    CapitalizedAmt: this.FinancialDataForm.controls["AssetFeeOplObjs"].value[i].CapitalizedAmt
    //  };
    //  listFee.push(newFee);
    //}

    //var listExpense = new Array();
    //for (let i = 0; i < this.FinancialDataForm.controls["AssetExpenseOplObjs"].value.length; i++) {
    //  var tempExpense = this.FinancialDataForm.controls["AssetExpenseOplObjs"].value.filter(
    //    expe => expe.ExpenseTypeOplCode == this.FinancialDataForm.controls["AssetExpenseOplObjs"].value[i].ExpenseTypeOplCode
    //  );
    //  if (tempExpense.length > 1) {
    //    this.isExpenseDupe = true;
    //    break;
    //  }
    //  var newExpense = {
    //    ExpenseTypeOplCode: this.FinancialDataForm.controls["AssetExpenseOplObjs"].value[i].ExpenseTypeOplCode,
    //    ExpenseAmt: this.FinancialDataForm.controls["AssetExpenseOplObjs"].value[i].ExpenseAmt
    //  };
    //  listExpense.push(newExpense);
    //}
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
      RentAmt: this.FinancialDataForm.controls.RentAmt.value,
      VatAmt: this.FinancialDataForm.controls.VatAmt.value,
      GrossYieldPrcnt: this.FinancialDataForm.controls.GrossYieldPrcnt.value
    };

    var RentSchdls = new Array();
    for (let i = 0; i < this.FinancialDataForm.controls["RentalPeriod"].value; i++) {
      var rentSchdl = {
        AppAssetId: this.AppAssetId,
        SeqNo: i + 1,
        RentAmt: 10000000,
        RentAmtExclVat: 10000000,
        VatAmt: 10000000,
        WithholdingTaxAmt: 10000000,
        CostAmt: 10000000,
        MarginAmt: 10000000,
        CofPrincipal: 10000000,
        CofInterest: 10000000
      };
      RentSchdls.push(rentSchdl);
    }

    var FinOplObj = {
      AppAssetRentDataOplObj: RentData,
      AppAssetRentSchdlOplObjs: RentSchdls
    };
    return FinOplObj;
  }

  isCalculate: boolean = false;
  changeCalculate() {
    this.isCalculate = false;
  }
}
