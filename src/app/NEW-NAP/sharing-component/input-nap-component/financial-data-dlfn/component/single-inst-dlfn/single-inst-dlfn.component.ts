import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ResponseCalculateObj } from 'app/shared/model/AppFinData/ResponseCalculateObj.Model';
import { CalcSingleInstObj } from 'app/shared/model/AppFinData/CalcSingleInstObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { InstallmentObj } from 'app/shared/model/AppFinData/InstallmentObj.Model';
import { ResGeneralSettingObj } from 'app/shared/model/Response/GeneralSetting/ResGeneralSettingObj.model';

@Component({
  selector: 'app-single-inst-dlfn',
  templateUrl: './single-inst-dlfn.component.html'
})
export class SingleInstDlfnComponent implements OnInit {


  @Input() AppId: number;
  @Input() ParentForm: FormGroup;

  InterestTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  calcSingleInstObj: CalcSingleInstObj = new CalcSingleInstObj();
  listInstallment: Array<InstallmentObj>;
  IsAppFeePrcntValid: boolean = true;
  TempTotalDisbAmt = 0;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
  ) { }

  ngOnInit() {
    this.LoadDDLInterestType();
    this.LoadMaturityDate();
  }

  LoadDDLInterestType() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInterestInputType }).subscribe(
      (response) => {
        this.InterestTypeOptions = response[CommonConstant.ReturnObj];
        if (this.InterestTypeOptions != undefined && this.InterestTypeOptions != null) {
          this.ParentForm.patchValue({
            InterestType: this.InterestTypeOptions[0].Key
          });
        }
      }
    );
  }

  LoadMaturityDate() {
    var topBased = this.ParentForm.get("TopBased").value;
    var maturityDate: Date;
    if (topBased == CommonConstant.TopCalcBasedInvcDt) {
      maturityDate = new Date(this.ParentForm.get("InvcDt").value);
      maturityDate.setDate(maturityDate.getDate() + this.ParentForm.get("TopDays").value);
      maturityDate.setMonth(maturityDate.getMonth() + this.ParentForm.get("Tenor").value);
    }

    if (topBased == CommonConstant.TopCalcBasedEffDt) {
      maturityDate = new Date(this.ParentForm.get("EstEffDt").value);
      maturityDate.setDate(maturityDate.getDate() + this.ParentForm.get("TopDays").value);
      maturityDate.setMonth(maturityDate.getMonth() + this.ParentForm.get("Tenor").value);
    }

    this.ParentForm.patchValue({
      MaturityDate: new Date(Date.UTC(maturityDate.getFullYear(), maturityDate.getMonth(), maturityDate.getDate()))
    });
  }

  async Calculate() {
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
    if (this.ParentForm.value.EffectiveRatePrcnt < 0 && this.ParentForm.value.InterestType == "PRCNT") {
      this.toastr.warningMessage(ExceptionConstant.EFFECTIVE_RATE_MUST_GREATER + '0.');
      return;
    }
    else {
      this.calcSingleInstObj = this.ParentForm.value;
      await this.http.post<ResponseCalculateObj>(URLConstant.CalculateSingleInstDlfn, this.calcSingleInstObj).toPromise().then(
        async (response) => {
          this.listInstallment = response.InstallmentTable;
          this.ParentForm.patchValue({
            EffectiveRatePrcnt: response.EffectiveRatePrcnt,
            InstAmt: response.InstAmt,
            TotalInterestAmt: response.TotalInterestAmt,
            TotalAR: response.TotalARAmt,
            NtfAmt: response.NtfAmt - response.TotalInterestAmt,
            RefundInterestAmt: response.RefundInterestAmt,
            TotalDisbAmt: response.TotalDisbAmt,
            GrossYieldPrcnt: response.GrossYieldPrcnt
          });
          this.TempTotalDisbAmt = response.TotalDisbAmt;
          await this.CalCulateTotalTopAmount(this.AppId, (response.NtfAmt - response.TotalInterestAmt));
          //this.SetInstallmentTable();
          this.SetNeedReCalculate(false);
          //this.CalcInterestAmt();
        }
      );
    }
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
        //InstAmt: this.listInstallment[i].InstAmt,
        InstAmt: this.ParentForm.get("InstAmt").value,
        //PrincipalAmt: this.listInstallment[i].PrincipalAmt,
        PrincipalAmt: this.ParentForm.get("InstAmt").value - this.ParentForm.get("TotalInterestAmt").value,
        //InterestAmt: this.listInstallment[i].InterestAmt,
        InterestAmt: this.ParentForm.get("TotalInterestAmt").value,
        //OsPrincipalAmt: this.listInstallment[i].OsPrincipalAmt,
        OsPrincipalAmt: this.ParentForm.get("InstAmt").value - this.ParentForm.get("TotalInterestAmt").value,
        //OsInterestAmt: this.listInstallment[i].OsInterestAmt,
        OsInterestAmt: this.ParentForm.get("TotalInterestAmt").value,
        //DueDt: this.listInstallment[i].DueDt
        DueDt: this.ParentForm.get("MaturityDate").value
      });
      (this.ParentForm.controls.InstallmentTable as FormArray).push(group);
    }
  }

  SetNeedReCalculate(value: boolean) {
    this.ParentForm.patchValue({
      NeedReCalculate: value
    });
  }

  EstEffDtFocusOut(event) {
    var topBased = this.ParentForm.get("TopBased").value;
    var maturityDate: Date;
    if (topBased == CommonConstant.TopCalcBasedInvcDt) {
      maturityDate = new Date(this.ParentForm.get("InvcDt").value);
      maturityDate.setDate(maturityDate.getDate() + this.ParentForm.get("TopDays").value);
      maturityDate.setMonth(maturityDate.getMonth() + this.ParentForm.get("Tenor").value);
    }

    if (topBased == CommonConstant.TopCalcBasedEffDt) {
      maturityDate = new Date(this.ParentForm.get("EstEffDt").value);
      maturityDate.setDate(maturityDate.getDate() + this.ParentForm.get("TopDays").value);
      maturityDate.setMonth(maturityDate.getMonth() + this.ParentForm.get("Tenor").value);
    }

    this.ParentForm.patchValue({
      MaturityDate: new Date(Date.UTC(maturityDate.getFullYear(), maturityDate.getMonth(), maturityDate.getDate()))
    });
  }

  async CalCulateTotalTopAmount(AppId: number, NtfAmount: number) {
    var generalSettingObj = {
      Code: "DAYS_IN_YEAR"
    }
    var result: ResGeneralSettingObj;
    await this.http.post(URLConstant.GetGeneralSettingByCode, generalSettingObj).toPromise().then(
      (response: ResGeneralSettingObj) => {
        result = response;
        var DaysInYear = 365;
        if (result.GsValue != undefined && result.GsValue != "") {
          DaysInYear = result.GsValue;
        }

        var obj = {
          Id: this.AppId
        }

        this.http.post(URLConstant.GetAppById, obj).toPromise().then(
          (responseApp) => {
            var MouCustId = responseApp['MouCustId']

            this.http.post(URLConstant.GetMouCustDlrFindById, { Id: MouCustId }).toPromise().then(
              (responseCustDlfn) => {
                var maturityDate = new Date(this.ParentForm.get("MaturityDate").value);
                var topDays = this.ParentForm.get("TopDays").value;
                var ntfAmt = this.ParentForm.get("NtfAmt").value;
                var estEffDt = new Date(this.ParentForm.get("EstEffDt").value);
                var interestType = this.ParentForm.get("InterestType").value;
                var interestAmt = this.ParentForm.get("TotalInterestAmt").value;
                var interestPrcnt = this.ParentForm.get("EffectiveRatePrcnt").value;

                maturityDate.setDate(maturityDate.getDate() - topDays);

                var Time = maturityDate.getTime() - estEffDt.getTime();
                var Days = Time / (1000 * 3600 * 24); //Diference in Days

                var DaysInYear = 365;
                if (result.GsValue != undefined && result.GsValue != "") {
                  DaysInYear = result.GsValue;
                }
                if (interestType == "PRCNT") {
                  interestAmt = (Days / DaysInYear) * ntfAmt * (interestPrcnt / 100);
                } else {
                  interestPrcnt = interestAmt / ((Days / DaysInYear) * ntfAmt) * 100;
                }

                this.ParentForm.patchValue({
                  TotalTopAmount: (responseCustDlfn["TopInterestRatePrcnt"] / 100) * (responseCustDlfn["TopDays"] / DaysInYear) * NtfAmount,
                  TotalDisbAmt: this.TempTotalDisbAmt - ((responseCustDlfn["TopInterestRatePrcnt"] / 100) * (responseCustDlfn["TopDays"] / DaysInYear) * NtfAmount),
                  EffectiveRatePrcnt: interestPrcnt,
                  InstAmt: this.TempTotalDisbAmt
                    - (responseCustDlfn["TopInterestRatePrcnt"] / 100) * (responseCustDlfn["TopDays"] / DaysInYear) * NtfAmount
                    + interestAmt,
                  TotalInterestAmt: interestAmt
                });

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
                    //InstAmt: this.listInstallment[i].InstAmt,
                    InstAmt: this.ParentForm.get("InstAmt").value,
                    //PrincipalAmt: this.listInstallment[i].PrincipalAmt,
                    PrincipalAmt: this.ParentForm.get("InstAmt").value - this.ParentForm.get("TotalInterestAmt").value,
                    //InterestAmt: this.listInstallment[i].InterestAmt,
                    InterestAmt: this.ParentForm.get("TotalInterestAmt").value,
                    //OsPrincipalAmt: this.listInstallment[i].OsPrincipalAmt,
                    OsPrincipalAmt: this.ParentForm.get("InstAmt").value - this.ParentForm.get("TotalInterestAmt").value,
                    //OsInterestAmt: this.listInstallment[i].OsInterestAmt,
                    OsInterestAmt: this.ParentForm.get("TotalInterestAmt").value,
                    //DueDt: this.listInstallment[i].DueDt
                    DueDt: this.ParentForm.get("MaturityDate").value
                  });
                  (this.ParentForm.controls.InstallmentTable as FormArray).push(group);
                }
              });
          });

      });
  }

  CalcInterestAmt() {
    var generalSettingObj = {
      Code: "DAYS_IN_YEAR"
    }
    var result: ResGeneralSettingObj;
    this.http.post(URLConstant.GetGeneralSettingByCode, generalSettingObj).toPromise().then(
      (response: ResGeneralSettingObj) => {
        result = response;

        var maturityDate = new Date(this.ParentForm.get("MaturityDate").value);
        var topDays = this.ParentForm.get("TopDays").value;
        var ntfAmt = this.ParentForm.get("NtfAmt").value;
        var estEffDt = new Date(this.ParentForm.get("EstEffDt").value);
        var interestType = this.ParentForm.get("InterestType").value;
        var totalDisbAmt = this.ParentForm.get("TotalDisbAmt").value;
        var totalTopAmount = this.ParentForm.get("TotalTopAmount").value;
        var interestAmt = this.ParentForm.get("TotalInterestAmt").value;
        var interestPrcnt = this.ParentForm.get("EffectiveRatePrcnt").value;

        maturityDate.setDate(maturityDate.getDate() - topDays);

        var Time = maturityDate.getTime() - estEffDt.getTime();
        var Days = Time / (1000 * 3600 * 24); //Diference in Days

        var DaysInYear = 365;
        if (result.GsValue != undefined && result.GsValue != "") {
          DaysInYear = result.GsValue;
        }
        if (interestType == "PRCNT") {
          interestAmt = Days * ntfAmt * (interestPrcnt / 100);
        } else {
          interestPrcnt = interestAmt / (Days * ntfAmt);
        }

        this.ParentForm.patchValue({
          EffectiveRatePrcnt: interestPrcnt,
          InstAmt: totalDisbAmt - totalTopAmount + interestAmt,
          TotalInterestAmt: interestAmt
        });
      });
  }
}
