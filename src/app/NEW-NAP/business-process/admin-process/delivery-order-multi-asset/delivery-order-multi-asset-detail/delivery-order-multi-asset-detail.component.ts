import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { forkJoin } from 'rxjs';
import { DeliveryOrderHObj } from 'app/shared/model/DeliveryOrderHObj.Model';

@Component({
  selector: 'app-delivery-order-multi-asset-detail',
  templateUrl: './delivery-order-multi-asset-detail.component.html',
  styles: []
})
export class DeliveryOrderMultiAssetDetailComponent implements OnInit {
  appId: number;
  agrmntId: number;
  doList: any;
  isCreateDOInvalid: boolean;
  createDOInvalidMsg: string;

  DOAssetForm = this.fb.group({
    DOAssetList: this.fb.array([])
  });

  AppTcForm = this.fb.group({});

  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) { 
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.appId = params['AppId'];
      }
      if (params['AgrmntId'] != null) {
        this.agrmntId = params['AgrmntId'];
      }
    });
  }

  ngOnInit() {
    var doRequest = { AppId: this.appId, AgrmntId: this.agrmntId };
    let getDOAssetList = this.httpClient.post(AdInsConstant.GetAssetListForDOMultiAsset, doRequest);
    var getDOList = this.httpClient.post(AdInsConstant.GetListDeliveryOrderHByAppIdAgrmntId, doRequest);
    forkJoin([getDOAssetList, getDOList]).subscribe(
      (response) => {
        var doAssetList = response[0]["AssetListForDOMultiAssetObj"];
        this.doList = response[1]["DeliveryOrderHObjs"];
        var formArray = this.DOAssetForm.get('DOAssetList') as FormArray;

        for (const item of doAssetList) {
          var formGroup = this.fb.group({
            AssetSeqNo: [item.AssetSeqNo],
            FullAssetName: [item.FullAssetName],
            AssetPriceAmt : [item.AssetPriceAmt],
            DownPaymentAmt : [item.DownPaymentAmt],
            SerialNo1 : [item.SerialNo1],
            SerialNo2 : [item.SerialNo2],
            OwnerName : [item.OwnerName],
            DeliveryNo : [item.DeliveryNo],
            DeliveryDt : [item.DeliveryDt],
            IsAvailable : [item.IsAvailable]
          });
          formArray.push(formGroup);
        }
      }
    );
  }

  createDOHandler(){
    this.isCreateDOInvalid = true;
    var formArray = this.DOAssetForm.get('DOAssetList') as FormArray;
    for (var i = 0; i < formArray.length; i++) {
      if(formArray.at(i).get("IsAvailable").value == true){
        this.isCreateDOInvalid = false;
        break;
      }
    }
    if(this.isCreateDOInvalid){
      this.createDOInvalidMsg = "At Least 1 Asset Must Be Selected";
      return false;
    }
    else{
      // show modal
    }
  }

}
