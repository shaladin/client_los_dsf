import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.Model';

@Component({
  selector: 'app-app-cust-asset-detail',
  templateUrl: './app-cust-asset-detail.component.html',
  styles: []
})

export class AppCustAssetDetailComponent implements OnInit {
  @Input() AppCustAssetId: number;
  @Input() AppCustId: number;
  CustAssetTypeList: Array<KeyValueObj>;
  Mode: string;

  CustAssetForm = this.fb.group({
    AppCustAssetId: [0],
    AppCustId: [0],
    MrCustAssetTypeId: ['', [Validators.required]],
    AssetDescr: [''],
    AssetValue: [0, [Validators.required, Validators.min(1)]],
    AssetQty: [0, [Validators.required, Validators.min(1)]],
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
    if(this.AppCustAssetId && this.AppCustAssetId > 0){
      this.Mode = "EDIT"
      this.httpClient.post(URLConstant.GetAppCustAssetByAppCustAssetId, { Id: this.AppCustAssetId }).toPromise().then(
        (response) => {
          this.CustAssetForm.patchValue({
            AppCustAssetId: response["AppCustAssetId"],
            AppCustId: response["AppCustId"],
            MrCustAssetTypeId: response["MrCustAssetTypeId"],
            AssetDescr: response["AssetDescr"],
            AssetValue: response["AssetValue"],
            AssetQty: response["AssetQty"],
            AssetTotalValue: response["AssetTotalValue"],
            RowVersion: response["RowVersion"]
          });
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
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
    if(this.AppCustAssetId && this.AppCustAssetId > 0){
      url = URLConstant.EditAppCustAsset;
    }
    else{
      url = URLConstant.AddAppCustAsset;
    }
    this.httpClient.post(url, formValue).toPromise().then(
      (response) => {
        this.activeModal.close(response);
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }

}
