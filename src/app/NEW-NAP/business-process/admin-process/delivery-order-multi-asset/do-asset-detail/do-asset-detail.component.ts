import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DatePipe } from '@angular/common';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-do-asset-detail',
  templateUrl: './do-asset-detail.component.html',
  styles: []
})
export class DoAssetDetailComponent implements OnInit {
  @Input() AppAssetId: number;
  @Input() AppId: number;
  listItem: FormArray;
  SerialNoList: any;

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
    listItem: this.fb.array([])
  });

  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder,
    public activeModalAsset: NgbActiveModal,
    private http: HttpClient
  ){}

  ngOnInit() {
    this.listItem = this.DOAssetDetail.get('listItem') as FormArray;

    var datePipe = new DatePipe("en-US");
    var reqAppAsset = { AppAssetId: this.AppAssetId, AppId: this.AppId};
    this.httpClient.post(URLConstant.GetAppAssetForDOMultiAsset, reqAppAsset).subscribe(
      (response) => {
        var appAsset = response["AppAssetObj"];
        var appCollateral = response["AppCollateralDoc"];
        appAsset.TempRegisLettDt = datePipe.transform(appAsset.TempRegisLettDt, "yyyy-MM-dd");
        
        this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
          AssetTypeCode: appAsset.AssetTypeCode
        }).subscribe(
          (response: any) => {
            while (this.listItem.length) {
              this.listItem.removeAt(0);
            }

            this.SerialNoList = response[CommonConstant.ReturnObj];
            for (let i = 0; i < this.SerialNoList.length; i++) {
              let eachDataDetail = this.fb.group({
                SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
                SerialNoValue: [''],
                IsMandatory: [this.SerialNoList[i].IsMandatory]
              }) as FormGroup;
              this.listItem.push(eachDataDetail);
            }

            for (let i = 0; i < this.listItem.length; i++) {
              if (this.listItem.controls[i]['controls']['IsMandatory'].value == true) {
                this.listItem.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
                this.listItem.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
              }
            }

            if (appAsset != undefined || appAsset != null) {
              for (let i = 0; i < this.listItem.length; i++) {
                if (this.listItem.controls[i] != null) {
                  this.listItem.controls[i]['controls']['SerialNoValue'].value = appAsset["SerialNo" + (i + 1)];
                }
              }
            }
          });
          
        this.DOAssetDetail.patchValue({
          ...appAsset
        });


        // jika first input, ambil isian collateral doc by type
        if(!appCollateral || appCollateral.length <= 0) 
          this.GenerateDefaultAssetDocs(appAsset.AssetTypeCode);
        else
          this.GenerateAppCollateralDocs(appCollateral)
      }
    );
  }

  GenerateDefaultAssetDocs(AssetTypeCode: string)
  {
    var assetDocs = [];
    var assetDocListobj = { AssetTypeCode: AssetTypeCode }
    this.http.post(URLConstant.GetRefAssetDocList, assetDocListobj).subscribe(
      (response) => {
        if (response[CommonConstant.ReturnObj].length > 0)
        {
          response[CommonConstant.ReturnObj].forEach(RefAssetDoc => {
            assetDocs.push({
              AppCollateralDocId: 0,
              AppCollateralId: 0,
              DocCode: RefAssetDoc.AssetDocCode,
              DocNo: null,
              DocName: RefAssetDoc.AssetDocName,
              IsReceived: false,
              ExpiredDt: null,
              DocNotes: RefAssetDoc.DocNotes,
              IsValueNeeded: RefAssetDoc.IsValueNeeded,
              IsMandatoryNew: RefAssetDoc.IsMandatoryNew,
              IsMandatoryUsed: RefAssetDoc.IsMandatoryUsed,
              MrCollateralConditionCode: CommonConstant.AssetConditionUsed,
            })    
          });
          this.GenerateAppCollateralDocs(assetDocs);
        }
      }
    );
    return assetDocs;
  }

  GenerateAppCollateralDocs(appCollateralDocs: any)
  {
    var formArray = this.DOAssetDetail.get('DOAssetDocList') as FormArray;
    for (const item of appCollateralDocs) {
      var isMandatory = false;
      if(item.MrCollateralConditionCode == CommonConstant.AssetConditionNew){
        if(item.IsMandatoryNew == true){
          isMandatory = true;
        }
      }
      else{
        if(item.IsMandatoryUsed == true){
          isMandatory = true;
        }
      }
      var formGroup = this.fb.group({
        AppCollateralDocId: [item.AppCollateralDocId],
        AppCollateralId: [item.AppCollateralId],
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

  Save(){
    var formData = this.DOAssetDetail.value;
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

    for (var i = 0; i < this.listItem.length; i++) {
      if (this.listItem.controls[i] != null) {
        appAssetData["SerialNo" + (i + 1)] = this.listItem.controls[i]["controls"]["SerialNoValue"].value;
      }
    }

    var appCollateralDocData = [...formData.DOAssetDocList];
    var requestData = { "AppAssetObj": appAssetData, "AppCollateralDocObj": appCollateralDocData};
    this.httpClient.post(URLConstant.EditAppAssetDOMultiAsset, requestData).subscribe(
      (response) => {
        this.activeModalAsset.close(response);
      });
  }
}
