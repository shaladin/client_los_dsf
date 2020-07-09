import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-do-asset-detail',
  templateUrl: './do-asset-detail.component.html',
  styles: []
})
export class DoAssetDetailComponent implements OnInit {
  @Input() AppAssetId: number;
  @Input() AppId: number;
  licensePlateNoMandatory: boolean;
  licensePlateAttr: string;
  serial1Mandatory: boolean;
  serial2Mandatory: boolean;
  // serial3Mandatory: boolean;
  // serial4Mandatory: boolean;
  // serial5Mandatory: boolean;

  DOAssetDetail = this.fb.group({
    AppAssetId: [0, [Validators.required]],
    AppId: [0, [Validators.required]],
    AgrmntId: [0, [Validators.required]],
    AssetSeqNo: [''],
    FullAssetCode: [''],
    FullAssetName: [''],
    MrAssetConditionCode: [''],
    MrAssetUsageCode: [''],
    AssetStat: [''],
    SerialNo1: [''],
    SerialNo2: [''],
    SerialNo3: [''],
    SerialNo4: [''],
    SerialNo5: [''],
    AssetPriceAmt: [''],
    DownPaymentAmt: [''],
    AssetTypeCode: [''],
    AssetCategoryCode: [''],
    AssetTaxDt: [''],
    SupplCode: [''],
    SupplName: [''],
    IsCollateral: [''],
    IsInsurance: [''],
    AssetNotes: [''],
    TempRegisLettNo: ['', [Validators.required]],
    TempRegisLettDt: ['', [Validators.required]],
    Color: [''],
    TaxCityIssuer: [''],
    TaxIssueDt: [''],
    ManufacturingYear: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.max(new Date().getFullYear())]],
    IsEditableDp: [''],
    RsvField1: [''],
    RsvField2: [''],
    RsvField3: [''],
    RsvField4: [''],
    RsvField5: [''],
    RowVersion: [''],
    DOAssetDocList: this.fb.array([]),
    LicensePlateNo: ['']
  });

  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder,
    public activeModalAsset: NgbActiveModal
  ) { 
    this.licensePlateNoMandatory = false;
    this.serial1Mandatory = false;
    this.serial2Mandatory = false;
  }

  ngOnInit() {
    var datePipe = new DatePipe("en-US");
    var reqAppAsset = { AppAssetId: this.AppAssetId, AppId: this.AppId};
    this.httpClient.post(AdInsConstant.GetAppAssetForDOMultiAsset, reqAppAsset).subscribe(
      (response) => {
        var appAsset = response["AppAssetObj"];
        var appCollateral = response["AppCollateralDoc"];
        appAsset.TempRegisLettDt = datePipe.transform(appAsset.TempRegisLettDt, "yyyy-MM-dd");
        if(appAsset.SerialNo1Label == AdInsConstant.LICENSE_PLATE_NO){
          this.DOAssetDetail.patchValue({
            LicensePlateNo: appAsset.SerialNo1
          });
          if(appAsset.IsMandatorySerialNo1 == true){
            this.SetLicensePlateMandatory();
          }
          this.licensePlateAttr = "SerialNo1";
        }
        else if(appAsset.SerialNo2Label == AdInsConstant.LICENSE_PLATE_NO){
          this.DOAssetDetail.patchValue({
            LicensePlateNo: appAsset.SerialNo2
          });
          if(appAsset.IsMandatorySerialNo2 == "1"){
            this.SetLicensePlateMandatory();
          }
          this.licensePlateAttr = "SerialNo2";
        }
        else if(appAsset.SerialNo3Label == AdInsConstant.LICENSE_PLATE_NO){
          this.DOAssetDetail.patchValue({
            LicensePlateNo: appAsset.SerialNo3
          });
          if(appAsset.IsMandatorySerialNo3 == "1"){
            this.SetLicensePlateMandatory();
          }
          this.licensePlateAttr = "SerialNo3";
        }
        else if(appAsset.SerialNo4Label == AdInsConstant.LICENSE_PLATE_NO){
          this.DOAssetDetail.patchValue({
            LicensePlateNo: appAsset.SerialNo4
          });
          if(appAsset.IsMandatorySerialNo4 == "1"){
            this.SetLicensePlateMandatory();
          }
          this.licensePlateAttr = "SerialNo4";
        }
        else if(appAsset.SerialNo5Label == AdInsConstant.LICENSE_PLATE_NO){
          this.DOAssetDetail.patchValue({
            LicensePlateNo: appAsset.SerialNo5
          });
          if(appAsset.IsMandatorySerialNo5 == "1"){
            this.SetLicensePlateMandatory();
          }
          this.licensePlateAttr = "SerialNo5";
        }

        if(appAsset.IsMandatorySerialNo1 == "1"){
          this.DOAssetDetail.controls["SerialNo1"].setValidators([Validators.required]);
          this.DOAssetDetail.controls["SerialNo1"].updateValueAndValidity();
          this.serial1Mandatory = true;
        }
        if(appAsset.IsMandatorySerialNo2 == "1"){
          this.DOAssetDetail.controls["SerialNo2"].setValidators([Validators.required]);
          this.DOAssetDetail.controls["SerialNo2"].updateValueAndValidity();
          this.serial2Mandatory = true;
        }

        this.DOAssetDetail.patchValue({
          ...appAsset
        });

        var formArray = this.DOAssetDetail.get('DOAssetDocList') as FormArray;
        for (const item of appCollateral) {
          var isMandatory = false;
          if(item.MrCollateralConditionCode == AdInsConstant.AssetConditionNew){
            console.log("New Collateral");
            if(item.IsMandatoryNew == true){
              isMandatory = true;
            }
          }
          else{
            console.log("Used Collateral");
            if(item.IsMandatoryUsed == true){
              isMandatory = true;
            }
          }
          var formGroup = this.fb.group({
            AppCollateralDocId: [item.AppCollateralDocId, [Validators.required]],
            AppCollateralId: [item.AppCollateralId, [Validators.required]],
            DocCode: [item.DocCode],
            DocName: [item.DocName],
            DocNo: [item.DocNo, isMandatory ? [Validators.required] : []],
            IsReceived: [item.IsReceived],
            ExpiredDt: [item.ExpiredDt],
            DocNotes: [item.DocNotes],
            IsValueNeeded: [item.IsValueNeeded],
            IsMandatoryNew: [item.IsMandatoryNew],
            IsMandatoryUsed: [item.IsMandatoryUsed],
            MrCollateralConditionCode: [item.MrCollateralConditionCode]
          });
          formArray.push(formGroup);
        }
      }
    );
  }

  SetLicensePlateMandatory(){
    this.DOAssetDetail.controls['LicensePlateNo'].setValidators([Validators.required]);
    this.DOAssetDetail.controls['LicensePlateNo'].updateValueAndValidity();
    this.licensePlateNoMandatory = true;
  }

  Save(){
    var formData = this.DOAssetDetail.value;
    formData[this.licensePlateAttr] = formData.LicensePlateNo;
    var appAssetData = {
      AppAssetId: formData.AppAssetId,
      AppId: formData.AppId,
      AgrmntId: formData.AgrmntId,
      AssetSeqNo: formData.AssetSeqNo,
      FullAssetCode: formData.FullAssetCode,
      FullAssetName: formData.FullAssetName,
      MrAssetConditionCode: formData.MrAssetConditionCode,
      MrAssetUsageCode: formData.MrAssetUsageCode,
      AssetStat: formData.AssetStat,
      SerialNo1: formData.SerialNo1,
      SerialNo2: formData.SerialNo2,
      SerialNo3: formData.SerialNo3,
      SerialNo4: formData.SerialNo4,
      SerialNo5: formData.SerialNo5,
      AssetPriceAmt: formData.AssetPriceAmt,
      DownPaymentAmt: formData.DownPaymentAmt,
      AssetTypeCode: formData.AssetTypeCode,
      AssetCategoryCode: formData.AssetCategoryCode,
      AssetTaxDt: formData.AssetTaxDt,
      SupplCode: formData.SupplCode,
      SupplName: formData.SupplName,
      IsCollateral: formData.IsCollateral,
      IsInsurance: formData.IsInsurance,
      AssetNotes: formData.AssetNotes,
      TempRegisLettNo: formData.TempRegisLettNo,
      TempRegisLettDt: formData.TempRegisLettDt,
      Color: formData.Color,
      TaxCityIssuer: formData.TaxCityIssuer,
      TaxIssueDt: formData.TaxIssueDt,
      ManufacturingYear: formData.ManufacturingYear,
      IsEditableDp: formData.IsEditableDp,
      RsvField1: formData.RsvField1,
      RsvField2: formData.RsvField2,
      RsvField3: formData.RsvField3,
      RsvField4: formData.RsvField4,
      RsvField5: formData.RsvField5,
      RowVersion: formData.RowVersion
    }
    var appCollateralDocData = [...formData.DOAssetDocList];
    var requestData = { "AppAssetObj": appAssetData, "AppCollateralDocObj": appCollateralDocData};
    this.httpClient.post(AdInsConstant.EditAppAssetDOMultiAsset, requestData).subscribe(
      (response) => {
        this.activeModalAsset.close(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
