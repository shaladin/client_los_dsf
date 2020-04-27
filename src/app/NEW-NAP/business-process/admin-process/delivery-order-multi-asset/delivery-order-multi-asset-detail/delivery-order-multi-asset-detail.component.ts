import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateDoMultiAssetComponent } from '../create-do-multi-asset/create-do-multi-asset.component';

@Component({
  selector: 'app-delivery-order-multi-asset-detail',
  templateUrl: './delivery-order-multi-asset-detail.component.html',
  styles: []
})
export class DeliveryOrderMultiAssetDetailComponent implements OnInit {
  appId: number;
  agrmntId: number;
  doList: any;
  doAssetList: any;
  custType: string;
  licensePlateAttr: string;
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
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
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
        this.doAssetList = response[0]["AssetListForDOMultiAssetObj"];
        this.custType = response[0]["MrCustTypeCode"];
        this.licensePlateAttr = response[0]["LicensePlateAttr"];
        this.doList = response[1]["DeliveryOrderHObjs"];
        var formArray = this.DOAssetForm.get('DOAssetList') as FormArray;

        for (const item of this.doAssetList) {
          var formGroup = this.fb.group({
            AppAssetId: [item.AppAssetId],
            AssetSeqNo: [item.AssetSeqNo],
            FullAssetName: [item.FullAssetName],
            AssetPriceAmt : [item.AssetPriceAmt],
            DownPaymentAmt : [item.DownPaymentAmt],
            SerialNo1 : [item.SerialNo1],
            SerialNo2 : [item.SerialNo2],
            SerialNo3 : [item.SerialNo3],
            SerialNo4 : [item.SerialNo4],
            SerialNo5 : [item.SerialNo5],
            OwnerName : [item.OwnerName],
            DeliveryNo : [item.DeliveryNo],
            DeliveryDt : [item.DeliveryDt],
            IsAvailable : [item.IsAvailable],
            ManufacturingYear: [item.ManufacturingYear],
            IsSelected: false
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
      if(formArray.at(i).get("IsSelected").value == true){
        this.isCreateDOInvalid = false;
        break;
      }
    }
    if(this.isCreateDOInvalid){
      this.createDOInvalidMsg = "At Least 1 Asset Must Be Selected";
      return false;
    }
    else{
      const modalCreateDO = this.modalService.open(CreateDoMultiAssetComponent);
      modalCreateDO.componentInstance.SelectedDOAssetList = formArray.value;
      modalCreateDO.componentInstance.LicensePlateAttr = this.licensePlateAttr;
      modalCreateDO.componentInstance.CustType = this.custType;
      modalCreateDO.componentInstance.AppId = this.appId;
      modalCreateDO.componentInstance.AgrmntId = this.agrmntId;
      modalCreateDO.result.then(
        (response) => {
          this.spinner.show();
          var doRequest = { AppId: this.appId, AgrmntId: this.agrmntId };
          let getDOAssetList = this.httpClient.post(AdInsConstant.GetAssetListForDOMultiAsset, doRequest);
          var getDOList = this.httpClient.post(AdInsConstant.GetListDeliveryOrderHByAppIdAgrmntId, doRequest);
          forkJoin([getDOAssetList, getDOList]).subscribe(
            (response) => {
              this.doAssetList = response[0]["AssetListForDOMultiAssetObj"];
              this.custType = response[0]["MrCustTypeCode"];
              this.licensePlateAttr = response[0]["LicensePlateAttr"];
              this.doList = response[1]["DeliveryOrderHObjs"];
              var formArray = this.DOAssetForm.get('DOAssetList') as FormArray;

              while(formArray.length !== 0){
                formArray.removeAt(0);
              }

              for (const item of this.doAssetList) {
                var formGroup = this.fb.group({
                  AppAssetId: [item.AppAssetId],
                  AssetSeqNo: [item.AssetSeqNo],
                  FullAssetName: [item.FullAssetName],
                  AssetPriceAmt : [item.AssetPriceAmt],
                  DownPaymentAmt : [item.DownPaymentAmt],
                  SerialNo1 : [item.SerialNo1],
                  SerialNo2 : [item.SerialNo2],
                  SerialNo3 : [item.SerialNo3],
                  SerialNo4 : [item.SerialNo4],
                  SerialNo5 : [item.SerialNo5],
                  OwnerName : [item.OwnerName],
                  DeliveryNo : [item.DeliveryNo],
                  DeliveryDt : [item.DeliveryDt],
                  IsAvailable : [item.IsAvailable],
                  ManufacturingYear: [item.ManufacturingYear],
                  IsSelected: false
                });
                formArray.push(formGroup);
              }
            }
          );
          this.spinner.hide();
          this.toastr.successMessage(response["message"]);
        }
      ).catch((error) => {
        if(error != 0){
          console.log(error);
        }
      });
    }
  }

  SaveForm(){

  }

}
