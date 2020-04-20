import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { CalcRegularFixObj } from 'app/shared/model/AppFinData/CalcRegularFixObj.Model';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-schm-reguler-fix',
  templateUrl: './schm-reguler-fix.component.html',
})
export class SchmRegulerFixComponent implements OnInit {

  @Input() AppId: number;
  @Input() ParentForm: FormGroup;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcRegFixObj: CalcRegularFixObj = new CalcRegularFixObj();
  listInstallment: any;
  responseCalc: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
  ) { }

  ngOnInit() {
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
  }

  LoadDDLRateType() {
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: "RATE_TYPE" }).subscribe(
      (response) => {
        this.RateTypeOptions = response["ReturnObject"];
      }
    );
  }

  LoadDDLGracePeriodType() {
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: "GRACE_PERIOD_TYPE" }).subscribe(
      (response) => {
        this.GracePeriodeTypeOptions = response["ReturnObject"];
      }
    );
  }

  CalcBaseOnRate() {
    this.calcRegFixObj = this.ParentForm.value;
    this.calcRegFixObj["IsRecalculate"] = true;
    this.http.post<ResponseCalculateObj>(environment.losUrl + "/AppFinData/CalculateInstallmentRegularFix", this.calcRegFixObj).subscribe(
      (response) => {
        this.listInstallment = response.InstallmentTable;
        this.ParentForm.patchValue({
          TotalDownPaymentNettAmt: response.TotalDownPaymentNettAmt, //muncul di layar
          TotalDownPaymentGrossAmt: response.TotalDownPaymentGrossAmt, //inmemory

          EffectiveRatePrcnt: response.EffectiveRatePrcnt,
          FlatRatePrcnt: response.FlatRatePrcnt,
          InstAmt: response.InstAmt,

          GrossYieldPrcnt: response.GrossYieldPrcnt,

          TotalInterestAmt: response.TotalInterestAmt,
          TotalAR: response.TotalARAmt,

          NtfAmt: response.NtfAmt,

        })

      }
    );
  }

  CalcBaseOnInst() {

  }

  SaveAndContinue() {
    var isValidGrossYield = this.ValidateGrossYield();
    var isValidGracePeriod = this.ValidateGracePeriode();

    if (isValidGrossYield && isValidGracePeriod) {
      console.log("GROSSSS");
    }
  }

  ValidateGracePeriode() {
    var valid: boolean = true;
    var gracePeriodType = this.ParentForm.get("MrGracePeriodTypeCode").value
    var gracePeriod = this.ParentForm.get("GracePeriod").value

    if (gracePeriodType != "") {
      if (gracePeriod == 0) {
        valid = false;
        this.toastr.errorMessage("Grace Period must be set");
      }
    }

    return valid;
  }

  ValidateGrossYield() {
    this.ParentForm.patchValue({
      GrossYieldPrcnt: 10
    });
    var GrossYieldBhv = this.ParentForm.get("GrossYieldBhv").value
    var StdGrossYieldPrcnt = this.ParentForm.get("StdGrossYieldPrcnt").value
    var GrossYieldPrcnt = this.ParentForm.get("GrossYieldPrcnt").value
    var valid: boolean = true;

    if (GrossYieldBhv == 'MIN') {
      if (GrossYieldPrcnt < StdGrossYieldPrcnt) {
        this.toastr.errorMessage("Gross Yield cannot be less than " + StdGrossYieldPrcnt + "%");
        valid = false;
      }
    }
    else {
      if (GrossYieldPrcnt > StdGrossYieldPrcnt) {
        this.toastr.errorMessage("Gross Yield cannot be greater than " + StdGrossYieldPrcnt + "%");
        valid = false;
      }
    }
    return valid;
  }

  EffectiveRatePrcntInput_FocusOut() {
    var EffectiveRatePrcnt = this.ParentForm.get("EffectiveRatePrcnt").value
    var SupplEffectiveRatePrcnt = this.ParentForm.get("SupplEffectiveRatePrcnt").value
    var StdEffectiveRatePrcnt = this.ParentForm.get("StdEffectiveRatePrcnt").value
    var DiffRateAmtStd = +StdEffectiveRatePrcnt - +SupplEffectiveRatePrcnt

    var diffRate = +EffectiveRatePrcnt - +SupplEffectiveRatePrcnt;
    if (diffRate < DiffRateAmtStd) {
      this.ParentForm.patchValue({
        DiffRateAmt: 0
      });
    }
    else {
      this.ParentForm.patchValue({
        DiffRateAmt: DiffRateAmtStd
      });
    }
  }

  test() {
    console.log(this.ParentForm)
    console.log(this.ParentForm.value);
  }

}
