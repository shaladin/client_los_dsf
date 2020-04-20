import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CalcRegularFixObj } from 'app/shared/model/AppFinData/CalcRegularFixObj.Model';

@Component({
  selector: 'app-app-fin-data',
  templateUrl: './app-fin-data.component.html',
})
export class AppFinDataComponent implements OnInit {

  // @Input() AppId : number;
  AppId : number;
  FinDataForm : FormGroup;
  RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
  appFinDataObj : AppFinDataObj = new AppFinDataObj();
  calcRegFixObj : CalcRegularFixObj = new CalcRegularFixObj();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
  ) { }

  ngOnInit() {
    this.AppId = 57;
    this.FinDataForm = this.fb.group(
      {
        AppId : this.AppId,
        TotalAssetPriceAmt : [0],
        TotalFeeAmt : [0],
        TotalFeeCptlzAmt : [0],
        TotalInsCustAmt : [0],
        InsCptlzAmt : [0],
        TotalLifeInsCustAmt : [0],
        LifeInsCptlzAmt : [0],
        DownPaymentGrossAmt : [0],
        DownPaymentNettAmt : [0],

        TotalDownPaymentNettAmt : [0], //muncul di layar
        TotalDownPaymentGrossAmt : [0], //inmemory
        TdpPaidCoyAmt : [0], // input layar

        NtfAmt : [0],
        RateType : ["EFCTV"],
        EffectiveRatePrcnt : [0], //eff rate to cust
        StdEffectiveRatePrcnt : [0], //base eff rate to cust
        FlatRatePrcnt : [0], //flat rate to cust
        InstAmt : [0],
        GracePeriod : [0],
        MrGracePeriodTypeCode : [""],

        NumOfInst : [0],
        RoundingAmt : [0],
        SupplEffectiveRatePrcnt : [0],
        SupplFlatRatePrcnt : [0],
        DiffRateAmt : [0],

        TotalInterestAmt: [0],
        TotalAR : [0],

        StdGrossYieldPrcnt : [0],
        GrossYieldPrcnt : [0],
        GrossYieldBhv : [""],

        AppFee : this.fb.array([])
      }
    );
    this.LoadAppFinData();
    this.LoadDDLRateType();
    this.LoadDDLGracePeriodType();
  }

  LoadAppFinData()
  {
    this.http.post<AppFinDataObj>(environment.losUrl + "/AppFinData/GetInitAppFinDataByAppId", { AppId: this.AppId }).subscribe(
      (response) => {
        this.appFinDataObj = response;

        this.FinDataForm.patchValue({
          TotalAssetPriceAmt : this.appFinDataObj.TotalAssetPriceAmt,
          TotalFeeAmt : this.appFinDataObj.TotalFeeAmt,
          TotalFeeCptlzAmt : this.appFinDataObj.TotalFeeCptlzAmt,
          TotalInsCustAmt : this.appFinDataObj.TotalInsCustAmt,
          InsCptlzAmt : this.appFinDataObj.InsCptlzAmt,
          TotalLifeInsCustAmt : this.appFinDataObj.TotalLifeInsCustAmt,
          LifeInsCptlzAmt : this.appFinDataObj.LifeInsCptlzAmt,
          DownPaymentGrossAmt : this.appFinDataObj.DownPaymentGrossAmt,
          DownPaymentNettAmt : this.appFinDataObj.DownPaymentNettAmt,

          EffectiveRatePrcnt : this.appFinDataObj.EffectiveRatePrcnt,
          StdEffectiveRatePrcnt : this.appFinDataObj.StdEffectiveRatePrcnt,

          NumOfInst : this.appFinDataObj.NumOfInst,
          RoundingAmt : this.appFinDataObj.RoundingAmt,
          SupplEffectiveRatePrcnt : this.appFinDataObj.SupplEffectiveRatePrcnt,

          DiffRateAmt : +this.appFinDataObj.StdEffectiveRatePrcnt - +this.appFinDataObj.SupplEffectiveRatePrcnt,

          StdGrossYieldPrcnt : this.appFinDataObj.StdGrossYieldPrcnt,
          GrossYieldPrcnt : this.appFinDataObj.GrossYieldPrcnt,
          GrossYieldBhv : this.appFinDataObj.GrossYieldBhv,

        });


      }
    );
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

  CalcBaseOnRate()
  {
    this.calcRegFixObj = this.FinDataForm.value;

    this.http.post(environment.losUrl + "/AppFinData/CalculateInstallmentRegularFix", this.calcRegFixObj).subscribe(
      (response) => {
        
      }
    );

    console.log(this.FinDataForm.value);
    console.log(this.calcRegFixObj);
  }

  CalcBaseOnInst()
  {
    
  }

  SaveAndContinue()
  {
    var isValidGrossYield = this.ValidateGrossYield();
    var isValidGracePeriod = this.ValidateGracePeriode();

    if(isValidGrossYield && isValidGracePeriod)
    {
      console.log("GROSSSS");
    }
  }

  ValidateGracePeriode()
  {
    var valid : boolean = true;
    var gracePeriodType = this.FinDataForm.get("MrGracePeriodTypeCode").value
    var gracePeriod = this.FinDataForm.get("GracePeriod").value
    
    if(gracePeriodType != "")
    {
      if(gracePeriod == 0)
      {
        valid = false;
        this.toastr.errorMessage("Grace Period must be set");
      }
    }

    return valid;
  }

  ValidateGrossYield()
  {
    this.FinDataForm.patchValue({
      GrossYieldPrcnt :10
    });
    var GrossYieldBhv = this.FinDataForm.get("GrossYieldBhv").value
    var StdGrossYieldPrcnt = this.FinDataForm.get("StdGrossYieldPrcnt").value
    var GrossYieldPrcnt = this.FinDataForm.get("GrossYieldPrcnt").value
    var valid : boolean = true;

    if(GrossYieldBhv == 'MIN')
    {
      if(GrossYieldPrcnt < StdGrossYieldPrcnt)
      {
        this.toastr.errorMessage("Gross Yield cannot be less than " + StdGrossYieldPrcnt + "%");
        valid = false;
      }
    }
    else
    {
      if(GrossYieldPrcnt > StdGrossYieldPrcnt)
      {
        this.toastr.errorMessage("Gross Yield cannot be greater than " + StdGrossYieldPrcnt + "%");
        valid = false;
      }
    }
    return valid;
  }

  EffectiveRatePrcntInput_FocusOut(){
    var EffectiveRatePrcnt = this.FinDataForm.get("EffectiveRatePrcnt").value
    var SupplEffectiveRatePrcnt = this.FinDataForm.get("SupplEffectiveRatePrcnt").value
    var StdEffectiveRatePrcnt = this.FinDataForm.get("StdEffectiveRatePrcnt").value
    var DiffRateAmtStd= +StdEffectiveRatePrcnt - +SupplEffectiveRatePrcnt

    var diffRate = +EffectiveRatePrcnt - +SupplEffectiveRatePrcnt;
    if(diffRate < DiffRateAmtStd)
    {
      this.FinDataForm.patchValue({
        DiffRateAmt : 0
      });
    }
    else
    {
      this.FinDataForm.patchValue({
        DiffRateAmt : DiffRateAmtStd
      });
    }
  }

  test()
  {
    console.log(this.FinDataForm)
    console.log(this.FinDataForm.value);
  }
}
