import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustAssetObj } from 'app/shared/model/AppCustAsset/AppCustAssetObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.Model';

@Component({
  selector: 'app-app-cust-asset-old-nap-detail',
  templateUrl: './app-cust-asset-old-nap-detail.component.html',
  styles: []
})

export class AppCustAssetOldNapDetailComponent implements OnInit {
  @Input() AppCustAssetObj: AppCustAssetObj;
  @Input() AppCustId: number;
  CustAssetTypeList: Array<KeyValueObj>;
  Mode: string;

  CustAssetForm = this.fb.group({
    AppCustAssetId: [0],
    AppCustId: [0],
    MrCustAssetTypeId: ['', [Validators.required]],
    AssetDescr: [''],
    AssetValue: [0],
    AssetQty: [0],
    AssetTotalValue: [0],
    RowVersion: ['']
  });

  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) { 
    this.CustAssetTypeList = new Array<KeyValueObj>();
    this.Mode = "ADD";
  }

  ngOnInit() {
    this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCustAsset }).toPromise().then(
      (response) => {
        this.CustAssetTypeList = response[CommonConstant.ReturnObj];
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
    if(this.AppCustAssetObj.AppCustAssetId && this.AppCustAssetObj.AppCustAssetId > 0){
      this.Mode = "EDIT"
      this.CustAssetForm.patchValue({
        AppCustAssetId: this.AppCustAssetObj.AppCustAssetId,
        AppCustId: this.AppCustAssetObj.AppCustId,
        MrCustAssetTypeId: this.AppCustAssetObj.MrCustAssetTypeId,
        AssetDescr: this.AppCustAssetObj.AssetDescr,
        AssetValue: this.AppCustAssetObj.AssetValue,
        AssetQty: this.AppCustAssetObj.AssetQty,
        AssetTotalValue: this.AppCustAssetObj.AssetTotalValue,
        RowVersion: this.AppCustAssetObj.RowVersion
      });
    }
    else{
      this.CustAssetForm.patchValue({
        AppCustId: this.AppCustId
      });
    }
  }

  SaveForm(){
    var formValue = this.CustAssetForm.value;
    formValue.AssetTotalValue = formValue.AssetValue * formValue.AssetQty;
    var url = "";
    if(this.Mode == "EDIT"){
      url = URLConstant.EditAppCustAsset;
    }
    else{
      url = URLConstant.AddAppCustAsset;
    }
    this.activeModal.close(formValue);
  }
}
