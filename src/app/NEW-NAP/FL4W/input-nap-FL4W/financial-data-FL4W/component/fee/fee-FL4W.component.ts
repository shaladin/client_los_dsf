import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormArray, Validators, Form, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AppFeeObj } from 'app/shared/model/app-fee-obj.model';
import { CalcProvisionFee } from 'app/shared/model/app-fee/calc-provision-fee.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';

@Component({
  selector: 'app-fee-FL4W',
  templateUrl: './fee-FL4W.component.html',
  styleUrls: ['./fee-FL4W.component.css']
})
export class FeeFL4WComponent implements OnInit {

  @Input() AppId : number;
  @Input() ParentForm : FormGroup;
  @Input() identifier : string;
  @Input() ProdOfferingCode: string;
  
  appFeeObj : AppFeeObj = new AppFeeObj();
  listAppFeeObj : Array<AppFeeObj> = new Array<AppFeeObj>();
  isSubmitted : boolean;
  TempProvisionSource : Array<KeyValueObj>;
  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) { }

  async ngOnInit(): Promise<void> {
    if (this.AppId != null) {
      await this.LoadAppFeeData(this.AppId);
    }
    else if (this.ProdOfferingCode != null) {
      await this.LoadAppFeeDataForTrialCalc(this.ProdOfferingCode);
    }
    // this.LoadCalcBaseDDL();
    this.CalculateTotalFeeAndCaptlzAmt()
  }

  // LoadCalcBaseDDL()
  // {
  //   this.ConstructProvision("NTF_MURNI",1000000);
  // }

  async LoadAppFeeData(AppId : number)
  {
    var RefMasterTypeCodeProvisionSource = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeProvisionSource
    }
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, RefMasterTypeCodeProvisionSource).subscribe(
      (response) => {
        this.TempProvisionSource = response[CommonConstant.ReturnObj];
      });


    await this.http.post(URLConstant.GetListAppFeeByAppId, { Id: AppId }).toPromise().then(
      (response) => {
        this.listAppFeeObj = response[CommonConstant.ReturnObj];
        for (let i = 0; i < this.listAppFeeObj.length ; i++) {

          var fa_AppFee = this.ParentForm.get(this.identifier) as FormArray
          fa_AppFee.push(this.addFeeControl(this.listAppFeeObj[i]));
          // this.AppFeeForm.push(this.addFeeControl(this.listAppFeeObj[i]));
        }

        this.PatchProvisionFeeValue();
        this.ProvisionFeeInput_FocusOut();
      }
    );
  }

  async LoadAppFeeDataForTrialCalc(ProdOfferingCode: string) {
    var RefMasterTypeCodeProvisionSource = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeProvisionSource
    }
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, RefMasterTypeCodeProvisionSource).subscribe(
      (response) => {
        this.TempProvisionSource = response[CommonConstant.ReturnObj];
      });

    var reqObj = {
      ProdOfferingCode: this.ProdOfferingCode,
      LobCode: this.ParentForm.get("LobCode").value,
      OfficeCode: this.ParentForm.get("OfficeCode").value,
      Tenor: this.ParentForm.controls["Tenor"].value,
      TotalAssetPrice: this.ParentForm.controls["AssetPriceAmt"].value
    }

    await this.http.post(URLConstant.GetListAppFeeForTrialCalc, reqObj).toPromise().then(
      (response) => {
        this.listAppFeeObj = response[CommonConstant.ReturnObj];
        for (let i = 0; i < this.listAppFeeObj.length; i++) {

          var fa_AppFee = this.ParentForm.get(this.identifier) as FormArray
          fa_AppFee.push(this.addFeeControl(this.listAppFeeObj[i]));
          // this.AppFeeForm.push(this.addFeeControl(this.listAppFeeObj[i]));
        }

        this.PatchProvisionFeeValue();
        this.ProvisionFeeInput_FocusOut();
      }
    );
  }

  IsCapitalize_CheckedChange(feeTypeCode){
    var fa_AppFee = this.ParentForm.get(this.identifier) as FormArray
    for (let i = 0; i < fa_AppFee.length ; i++) {
      var item = fa_AppFee.at(i);
      if(item.get("MrFeeTypeCode").value == feeTypeCode){
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
    }
    this.CalculateProvisionFee();
    this.CalculateTotalFeeAndCaptlzAmt();
  }

  CalcBase_OnChange(event)
  {
    this.CalculateProvisionFee();
    this.PatchProvisionFeeValue();
  }

  // ConstructProvision(calcBase: string,calculateBaseAmt:number)
  // {
  //   var fa_AppFee = this.ParentForm.get(this.identifier) as FormArray
  //   for (let i = 0; i < fa_AppFee.length ; i++) {
  //     var item = fa_AppFee.at(i);
  //     var feeTypeCode = item.get("MrFeeTypeCode").value;
  //     if(feeTypeCode == 'PROVISION')
  //     {
  //       var appFeePrcnt : number = item.get("AppFeePrcnt").value;
  //       var feeType = item.get("FeeType").value;
  //       if(feeType == 'PRCNT')
  //       {
  //         item.patchValue({
  //           CalculateBase : calcBase,
  //           CalculateBaseAmt : calculateBaseAmt,
  //           AppFeeAmt : appFeePrcnt * calculateBaseAmt
  //         });
  //       }
  //     }
  //   }
  // }

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
  
  AppFeeAmt_OnChange()
  {
    this.CalculateTotalFeeAndCaptlzAmt();
  }

  FeeCapitalizeAmt_OnChange()
  {
    this.CalculateProvisionFee();
    this.CalculateTotalFeeAndCaptlzAmt();
  }

  FeeCapitalizeType_CheckedChange()
  {
    this.PatchProvisionFeeValue();
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
      
      totalFeeAmt += +appFeeAmt;
      totalCaptlz += +feeCapitalizeAmt;
    }

    this.ParentForm.patchValue({
      NeedReCalculate : true,
      TotalFeeAmt : totalFeeAmt,
      TotalFeeCptlzAmt : totalCaptlz
    })

    this.PatchProvisionFeeValue();
  }

  PatchProvisionFeeValue()
  {
    var fb_provision = this.GetProvisionFormGroup();

    this.ParentForm.patchValue({
      MrProvisionFeeTypeCode : fb_provision.get("FeeType").value,
      MrProvisionFeeCalcMethodCode : fb_provision.get("FeeSource").value
    })

  }




  addFeeControl(obj : AppFeeObj) {
    var feeSource = "";
    var feeType = obj.FeeType;

    if(obj.MrFeeTypeCode == CommonConstant.MrFeeTypeCodeProvision)
    {
      if(feeType == "" || feeType == null)
      {
        feeType = CommonConstant.FeeTypePrcnt
      }
      feeSource = "NTF_WITHOUT_CAP"
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
      AppFeePrcnt : [obj.AppFeePrcnt, [Validators.min(0.00), Validators.max(100.00)]],
      IsCptlz : obj.IsCptlz,
      // CptlzAmt : obj.CptlzAmt,
      FeeCapitalizeType : obj.FeeCapitalizeType,
      FeeCapitalizeAmt : obj.FeeCapitalizeAmt,
      FeeCapitalizePrcnt : obj.FeeCapitalizePrcnt,
      CalculateBaseAmt : 0,
      CalculateBase : '',
      FeeType : feeType,
      FeeSource : feeSource,
    })
  }

  ProvisionFeeInput_FocusOut()
  {
    this.CalculateProvisionFee(); 
  }

  CalculateProvisionFee(){
    var fb_provision = this.GetProvisionFormGroup();

    var calcObj : CalcProvisionFee = new CalcProvisionFee();
    calcObj.ProvisionFeeSource = fb_provision.get("FeeSource").value;
    calcObj.ProvisionFeeType = fb_provision.get("FeeType").value;
    calcObj.AppId = this.AppId;
    calcObj.DownPaymentGrossAmt = this.ParentForm.get("DownPaymentGrossAmt").value;
    calcObj.InsCapitalizedAmt = this.ParentForm.get("InsCptlzAmt").value;
    calcObj.TotalAssetPrice = this.ParentForm.get("TotalAssetPriceAmt").value;
    calcObj.LifeInsCapitalizedAmt = this.ParentForm.get("LifeInsCptlzAmt").value;
    calcObj.Fee = this.ParentForm.get(this.identifier).value;


    this.http.post(URLConstant.CalculateProvisionFee, calcObj).subscribe(
      (response) => {
        response["ProvisionFeePercentage"];
        var fb_provision = this.GetProvisionFormGroup();
 
          fb_provision.patchValue({
            AppFeeAmt : response["ProvisionFeeAmt"],
            AppFeePrcnt : response["ProvisionFeePercentage"],
            StdFeeAmt: response["StdProvisionFeeAmt"],
            StdFeePrcnt: response["StdProvisionFeePercentage"],
            SellFeeAmt: response["SellProvisionFeeAmt"],
            SellFeePrcnt: response["SellProvisionFeePercentage"]
          });

          this.CalculateTotalFeeAndCaptlzAmt();
      }
    );
  }


  xxx(){
  }

}
