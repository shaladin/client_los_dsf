import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CalcRegularFixObj } from 'app/shared/model/AppFinData/CalcRegularFixObj.Model';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { environment } from 'environments/environment';
import { CalcEvenPrincipleObj } from 'app/shared/model/AppFinData/CalcEvenPrincipleObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { InstallmentObj } from 'app/shared/model/AppFinData/InstallmentObj.Model';
import { ResGeneralSettingObj } from 'app/shared/model/Response/GeneralSetting/ResGeneralSettingObj.model';

@Component({
  selector: 'app-schm-even-principal-dlfn',
  templateUrl: './schm-even-principal-dlfn.component.html'
})
export class SchmEvenPrincipalDlfnComponent implements OnInit {


  @Input() AppId: number;
  @Input() ParentForm: FormGroup;

  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcEvenPrincipleObj: CalcEvenPrincipleObj = new CalcEvenPrincipleObj();
  listInstallment: Array<InstallmentObj>;
  IsAppFeePrcntValid: boolean = true;

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
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeRateType }).subscribe(
      (response) => {
        this.RateTypeOptions = response[CommonConstant.ReturnObj];
      }
    );
  }

  LoadDDLGracePeriodType() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGracePeriodType }).subscribe(
      (response) => {
        this.GracePeriodeTypeOptions = response[CommonConstant.ReturnObj];
      }
    );
  }

  CalculateInstallment() {
    this.IsAppFeePrcntValid = true;

    if (this.ParentForm.value.EstEffDt == "") {
      this.toastr.warningMessage(ExceptionConstant.INSERT_ESTIMATION_EFFECTIVE_DATE);
      return;
    }
    for (let i = 0; i < this.ParentForm.value.AppFee.length; i++) {
      if (this.ParentForm.value.AppFee[i].AppFeePrcnt < 0) {
        this.IsAppFeePrcntValid = false;
      }
    }
    if (this.IsAppFeePrcntValid == false) {
      this.toastr.warningMessage(ExceptionConstant.APP_FEE_PRCNT_MUST_GREATER + '0.');
      return;
    }
    if (this.ParentForm.value.EffectiveRatePrcnt < 0) {
      this.toastr.warningMessage(ExceptionConstant.EFFECTIVE_RATE_MUST_GREATER + '0.');
      return;
    }

    this.calcEvenPrincipleObj = this.ParentForm.getRawValue();
    this.http.post<ResponseCalculateObj>(URLConstant.CalculateInstallmentEvenPrincipalDlfn, this.calcEvenPrincipleObj).subscribe(
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
          TotalDisbAmt: response.TotalDisbAmt,
        })
        this.SetInstallmentTable();
        this.SetNeedReCalculate(false);
        this.CalCulateTotalTopAmount(this.AppId, response.NtfAmt);

      }
    );
  }

  SetInstallmentTable() {
    var ctrInstallment = this.ParentForm.get("InstallmentTable");
    if (!ctrInstallment) {
      this.ParentForm.addControl("InstallmentTable", this.fb.array([]))
    }

    while ((this.ParentForm.controls.InstallmentTable as FormArray).length) {
      (this.ParentForm.controls.InstallmentTable as FormArray).removeAt(0);
    }

    for (let i = 0; i < this.listInstallment.length; i++) {
      const group = this.fb.group({
        InstSeqNo: this.listInstallment[i].InstSeqNo,
        InstAmt: this.listInstallment[i].InstAmt,
        PrincipalAmt: this.listInstallment[i].PrincipalAmt,
        InterestAmt: this.listInstallment[i].InterestAmt,
        OsPrincipalAmt: this.listInstallment[i].OsPrincipalAmt,
        OsInterestAmt: this.listInstallment[i].OsInterestAmt
      });
      (this.ParentForm.controls.InstallmentTable as FormArray).push(group);
    }
  }

  EffectiveRatePrcntInput_FocusOut() {
    this.ParentForm.patchValue({
      DiffRateAmt: 0
    });

    this.SetNeedReCalculate(true);
  }

  SetNeedReCalculate(value: boolean) {
    this.ParentForm.patchValue({
      NeedReCalculate: value
    });
  }

  EstEffDtFocusOut(event) {
    var maturityDate: Date = new Date(this.ParentForm.get("EstEffDt").value);
    maturityDate.setMonth(maturityDate.getMonth() + this.ParentForm.get("Tenor").value);

    this.ParentForm.patchValue({
      MaturityDate: maturityDate
    });
  }


  CalCulateTotalTopAmount(AppId: number, NtfAmount: number) {
    var generalSettingObj = {
      Code: "DAYS_IN_YEAR"
    }
    var result: ResGeneralSettingObj;
    this.http.post(URLConstant.GetGeneralSettingByCode, generalSettingObj).subscribe(
      (response: ResGeneralSettingObj) => {
        result = response;
        var DaysInYear = 365;
        if (result.GsValue != undefined && result.GsValue != "") {
          DaysInYear = result.GsValue;
        }

        var obj = {
          Id: this.AppId
        }

        this.http.post(URLConstant.GetAppDlrFinByAppId, obj).toPromise().then(
          (responseAppDlfn) => {
            this.ParentForm.patchValue({
              TotalTopAmount: responseAppDlfn["TopInterestRatePrcnt"] / 100 * (responseAppDlfn["TopDays"] / DaysInYear) * NtfAmount,
            });
          });
      });
  }

}
