import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormArray, Validators, Form, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AppFeeObj } from 'app/shared/model/AppFeeObj.Model';
import { CalcProvisionFee } from 'app/shared/model/AppFee/CalcProvisionFee.Model';

@Component({
  selector: 'app-fee',
  templateUrl: './fee.component.html'
})
export class FeeComponent implements OnInit {

  @Input() AppId : number;
  @Input() ParentForm : FormGroup;
  @Input() identifier : string;
  
  appFeeObj : AppFeeObj = new AppFeeObj();
  listAppFeeObj : Array<AppFeeObj> = new Array<AppFeeObj>();
  isSubmitted : boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.LoadAppFeeData(this.AppId);
    this.LoadCalcBaseDDL();
    this.CalculateTotalFeeAndCaptlzAmt()
  }

  LoadCalcBaseDDL()
  {
    this.ConstructProvision("NTF_MURNI",1000000);
  }

  async LoadAppFeeData(AppId : number)
  {
    await this.http.post(environment.losUrl + "/AppFee/GetListAppFeeByAppId", { AppId: AppId }).toPromise().then(
      (response) => {
        this.listAppFeeObj = response["ReturnObject"];
        for (let i = 0; i < this.listAppFeeObj.length ; i++) {

          console.log(this.identifier);
          var fa_AppFee = this.ParentForm.get(this.identifier) as FormArray
          fa_AppFee.push(this.addFeeControl(this.listAppFeeObj[i]));
          // this.AppFeeForm.push(this.addFeeControl(this.listAppFeeObj[i]));
        }
      }
    );
  }

  IsCapitalize_CheckedChange(){
    var fa_AppFee = this.ParentForm.get(this.identifier) as FormArray
    for (let i = 0; i < fa_AppFee.length ; i++) {
      var item = fa_AppFee.at(i);
      var isCapitalize : Boolean = item.get("IsCptlz").value;
      if(isCapitalize)
      {
        item.patchValue({
          FeeCapitalizeAmt : item.get("AppFeeAmt").value
        });
        // item.get("AppId").enable();
      }
      else
      {
        item.patchValue({
          FeeCapitalizeAmt : 0
        });
        // item.get("AppId").disable();
      }
    }
    this.CalculateTotalFeeAndCaptlzAmt();
  }

  ConstructProvision(calcBase: string,calculateBaseAmt:number)
  {
    var fa_AppFee = this.ParentForm.get(this.identifier) as FormArray
    for (let i = 0; i < fa_AppFee.length ; i++) {
      var item = fa_AppFee.at(i);
      var feeTypeCode = item.get("MrFeeTypeCode").value;
      if(feeTypeCode == 'PROVISION')
      {
        var appFeePrcnt : number = item.get("AppFeePrcnt").value;
        var feeType = item.get("FeeType").value;
        if(feeType == 'PRCNT')
        {
          item.patchValue({
            CalculateBase : calcBase,
            CalculateBaseAmt : calculateBaseAmt,
            AppFeeAmt : appFeePrcnt * calculateBaseAmt
          });
        }
      }
    }
  }

  GetProvisionFormGroup()
  {
    var fa_AppFee = this.ParentForm.get(this.identifier) as FormArray
    for (let i = 0; i < fa_AppFee.length ; i++) {
      var item = fa_AppFee.at(i);
      var feeTypeCode = item.get("MrFeeTypeCode").value;
      if(feeTypeCode == 'PROVISION')
      {
        return item;
      }
    }
  }

  // AppFeePrcnt_OnChange(e)
  // {
  //   var fb_provision = this.GetProvisionFormGroup();
  //   var calculateBaseAmt = fb_provision.get("CalculateBaseAmt").value;
  //   var appFeePrcnt = fb_provision.get("AppFeePrcnt").value;

  //   fb_provision.patchValue({
  //     AppFeeAmt : appFeePrcnt * calculateBaseAmt
  //   });

  //   this.IsCapitalize_CheckedChange();
  // }
  
  // AppFeeAmt_OnChange()
  // {
  //   var fb_provision = this.GetProvisionFormGroup();
  //   var feeType = fb_provision.get("FeeType").value;
  //   var calculateBaseAmt : number = fb_provision.get("CalculateBaseAmt").value;
  //   var appFeeAmt : number = fb_provision.get("AppFeeAmt").value;
    
  //   fb_provision.patchValue({
  //     AppFeePrcnt : +appFeeAmt / +calculateBaseAmt
  //   });

  //   this.CalculateTotalFeeAndCaptlzAmt();
  // }

  FeeCapitalizeAmt_OnChange()
  {
    this.CalculateTotalFeeAndCaptlzAmt();
  }

  FeeCapitalizeType_CheckedChange()
  {
    
  }

  CalculateTotalFeeAndCaptlzAmt()
  {
    var fa_AppFee = this.ParentForm.get(this.identifier) as FormArray
    var totalFeeAmt : number = 0;
    var totalCaptlz : number = 0;
    for (let i = 0; i < fa_AppFee.length ; i++) {
      var item = fa_AppFee.at(i);
      var appFeeAmt = item.get("AppFeeAmt").value;

      var feeCapitalizeAmt = item.get("FeeCapitalizeAmt").value;
      
      console.log(appFeeAmt);
      totalFeeAmt += +appFeeAmt;
      totalCaptlz += +feeCapitalizeAmt;
    }

    this.ParentForm.patchValue({
      TotalFeeAmt : totalFeeAmt,
      TotalFeeCptlzAmt : totalCaptlz
    })

    console.log(this.ParentForm.value);
  }




  addFeeControl(obj : AppFeeObj) {
    var feeSource = "";
    if(obj.MrFeeTypeCode == 'PROVISION')
    {
      feeSource = "NTF_CAP"
    }

    return this.fb.group({
      AppFeeId : obj.AppFeeId,
      AppId: [obj.AppId,Validators.required],
      MrFeeTypeCode : obj.MrFeeTypeCode,
      FeeTypeName : obj.FeeTypeName,
      StdFeeAmt : obj.StdFeeAmt,
      SellFeeAmt : obj.SellFeeAmt,
      AppFeeAmt : obj.AppFeeAmt,
      StdFeePrcnt : obj.StdFeePrcnt,
      SellFeePrcnt : obj.SellFeePrcnt,
      AppFeePrcnt : obj.AppFeePrcnt,
      IsCptlz : obj.IsCptlz,
      // CptlzAmt : obj.CptlzAmt,
      FeeCapitalizeType : obj.FeeCapitalizeType,
      FeeCapitalizeAmt : obj.FeeCapitalizeAmt,
      FeeCapitalizePrcntg : obj.FeeCapitalizePrcntg,
      CalculateBaseAmt : 0,
      CalculateBase : '',
      FeeType : obj.FeeType,
      FeeSource : feeSource,
    })
  }

  ProvisionFeeInput_FocusOut()
  {

    var fb_provision = this.GetProvisionFormGroup();

    var calcObj : CalcProvisionFee = new CalcProvisionFee();
    calcObj.ProvisionFeeSource = fb_provision.get("FeeSource").value;
    calcObj.ProvisionFeeType = fb_provision.get("FeeType").value;
    calcObj.AppId = this.AppId;
    calcObj.DownPaymentGrossAmt = this.ParentForm.get("DownPaymentGrossAmt").value;
    calcObj.InsCapitalizedAmt = this.ParentForm.get("InsCptlzAmt").value;
    calcObj.TotalAssetPrice = this.ParentForm.get("TotalAssetPriceAmt").value;
    calcObj.Fee = this.ParentForm.get(this.identifier).value;


    this.http.post(environment.losUrl + "/AppFee/CalculateProvisionFee", calcObj).subscribe(
      (response) => {
        response["ProvisionFeePercentage"];
        var fb_provision = this.GetProvisionFormGroup();
 
          fb_provision.patchValue({
            AppFeeAmt : response["ProvisionFeeAmt"],
            AppFeePrcnt : response["ProvisionFeePercentage"]
          });
      }
    );

    // if(feeType == 'PRCNT')
    // {
    //   var calculateBaseAmt = fb_provision.get("CalculateBaseAmt").value;
    //   var appFeePrcnt = fb_provision.get("AppFeePrcnt").value;
  
    //   fb_provision.patchValue({
    //     AppFeeAmt : appFeePrcnt * calculateBaseAmt
    //   });
  
    //   // this.IsCapitalize_CheckedChange();
    // }
    // else
    // {
    //   this.AppFeeAmt_OnChange();
    // }
  }


  xxx(){
    console.log(this.ParentForm);
  }

}
