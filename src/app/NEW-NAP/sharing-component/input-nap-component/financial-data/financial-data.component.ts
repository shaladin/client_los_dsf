import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CalcRegularFixObj } from 'app/shared/model/AppFinData/CalcRegularFixObj.Model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-financial-data',
  templateUrl: './financial-data.component.html',
})
export class FinancialDataComponent implements OnInit {
// @Input() AppId : number;
AppId : number;
FinDataForm : FormGroup;
RateTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
GracePeriodeTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
appFinDataObj : AppFinDataObj = new AppFinDataObj();
calcRegFixObj : CalcRegularFixObj = new CalcRegularFixObj();
listInstallment : any;
responseCalc : any;
NumOfInst : number;
IsParentLoaded : boolean = false;

constructor(
  private fb: FormBuilder,
  private http: HttpClient,
  private toastr: NGXToastrService,
  private route: ActivatedRoute,
) { 
  this.route.queryParams.subscribe(params => {
    this.AppId = params["AppId"];
  });
}

ngOnInit() {
  this.FinDataForm = this.fb.group(
    {
      AppId : this.AppId,

      TotalAssetPriceAmt : 0,
      TotalFeeAmt :0,
      TotalFeeCptlzAmt :0,
      TotalInsCustAmt : 0,
      InsCptlzAmt : 0,
      TotalLifeInsCustAmt : 0,
      LifeInsCptlzAmt : 0,
      DownPaymentGrossAmt : 0,
      DownPaymentNettAmt : 0,

      TotalDownPaymentNettAmt : 0, //muncul di layar
      TotalDownPaymentGrossAmt : 0, //inmemory
      TdpPaidCoyAmt : 0, // input layar

      NtfAmt : 0,
      RateType : "EFCTV",
      EffectiveRatePrcnt : 0, //eff rate to cust
      StdEffectiveRatePrcnt : 0, //base eff rate to cust
      FlatRatePrcnt : 0, //flat rate to cust
      InstAmt : 0,
      GracePeriod : 0,
      MrGracePeriodTypeCode : "",

      NumOfInst : 0,
      RoundingAmt : 0,
      SupplEffectiveRatePrcnt : 0,
      SupplFlatRatePrcnt : 0,
      DiffRateAmt : 0,

      TotalInterestAmt: 0,
      TotalAR : 0,

      StdGrossYieldPrcnt : 0,
      GrossYieldPrcnt : 0,
      GrossYieldBhv : "",

      NumOfStep : 0,    
      MrInstSchemeCode: "",
      CummulativeTenor: 0,
      StepUpStepDownInputType: "",

      AppFee : this.fb.array([]),
      ListEntryInst: this.fb.array([]),

      MrProvisionFeeTypeCode : '',
      MrProvisionFeeCalcMethodCode : '',
      BalloonValueAmt: 0,
      NeedReCalculate: true
    }
  );
  this.LoadAppFinData();
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

        MrInstSchemeCode: this.appFinDataObj.MrInstSchemeCode,
        CummulativeTenor: this.appFinDataObj.CummulativeTenor,

      });

      this.IsParentLoaded = true;
    }
  );
}

SaveAndContinue()
{
  var isValidGrossYield = true;//this.ValidateGrossYield();
  var isValidGracePeriod = this.ValidateGracePeriode();

  var NeedReCalculate = this.FinDataForm.get("NeedReCalculate").value;

  if(NeedReCalculate)
  {
    this.toastr.errorMessage("Please Calculate Again");
    return ;
  }

  this.toastr.successMessage("Calc Ok");

  // if(isValidGrossYield && isValidGracePeriod)
  // {
  //   console.log("GROSSSS");
  //   console.log(this.FinDataForm.value);

  //   this.http.post(environment.losUrl + "/AppFinData/SaveAppFinData", this.FinDataForm.value).subscribe(
  //     (response) => {
  //      console.log(response);
  //     }
  //   );
  // }
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

// EffectiveRatePrcntInput_FocusOut(){
//   var EffectiveRatePrcnt = this.FinDataForm.get("EffectiveRatePrcnt").value
//   var SupplEffectiveRatePrcnt = this.FinDataForm.get("SupplEffectiveRatePrcnt").value
//   var StdEffectiveRatePrcnt = this.FinDataForm.get("StdEffectiveRatePrcnt").value
//   var DiffRateAmtStd= +StdEffectiveRatePrcnt - +SupplEffectiveRatePrcnt

//   var diffRate = +EffectiveRatePrcnt - +SupplEffectiveRatePrcnt;
//   if(diffRate < DiffRateAmtStd)
//   {
//     this.FinDataForm.patchValue({
//       DiffRateAmt : 0
//     });
//   }
//   else
//   {
//     this.FinDataForm.patchValue({
//       DiffRateAmt : DiffRateAmtStd
//     });
//   }
// }

test()
{
  console.log(this.FinDataForm)
  console.log(this.FinDataForm.value);
}
}
