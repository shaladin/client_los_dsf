import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCollateralAccessoryObj } from 'app/shared/model/app-collateral-accessory-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';

@Component({
  selector: 'app-view-delivery-order-asset-single',
  templateUrl: './view-delivery-order-asset-single.component.html'
})
export class ViewDeliveryOrderAssetSingleComponent implements OnInit {
  @Input() AppAssetId: number;
  @Input() AppId: number;
  appAsset: any;
  appCollateralRegistration: any;
  assetUsageName: string;
  assetCondition: string;
  ownerProfessionName: string;
  assetUserRelationship: string;
  AssetTypeObj: any;
  appCollateralDoc: any;
  inputGridObj: InputGridObj = new InputGridObj();
  AppCollateralAccessoryObjs : Array<AppCollateralAccessoryObj> = new Array<AppCollateralAccessoryObj>();

  constructor(private http: HttpClient, public activeModal: NgbActiveModal) { }

  async ngOnInit() {
    this.inputGridObj.pagingJson = "./assets/ucgridview/app-view/gridAppCollateralAccessory.json";

    await this.getDOAsset();
    await this.getAppAsset();
    await this.getAppCollReg();
    this.getAssetConditionDesc(this.appAsset.MrAssetConditionCode);
    this.getAssetUsageDesc(this.appAsset.MrAssetUsageCode);
    this.getAssetUserRelationshipDesc(this.appCollateralRegistration.MrUserRelationshipCode);
    this.getAssetType(this.appAsset.AssetTypeCode);
    this.getOwnerProfessionDesc(this.appCollateralRegistration.OwnerProfessionCode)
    this.getCollateralAccData();
  }

  async getDOAsset() {
    let reqAppAsset = { AppAssetId: this.AppAssetId, AppId: this.AppId};
    await this.http.post(URLConstant.GetAppAssetForDOMultiAsset, reqAppAsset).toPromise().then(
      response => {
        this.appCollateralDoc = response["AppCollateralDoc"];
      }
    )
  }

  async getAppAsset() {
    await this.http.post(URLConstant.GetAppAssetByAppAssetIdWithSerialNoDefinition, { Id: this.AppAssetId }).toPromise().then(
      response => {
        this.appAsset = response;
      }
    )
  }

  async getAppCollReg() {
    await this.http.post(URLConstant.GetAppCollateralRegistrationByAppAssetId, { Id: this.appAsset.AppAssetId }).toPromise().then(
      response => {
        this.appCollateralRegistration = response;
      }
    )
  }

  getAssetUsageDesc(Code: string){
    let reqByCode: GenericObj = new GenericObj();
    reqByCode.Code = Code;
    this.http.post(URLConstant.GetRefMasterByMasterCode, reqByCode).subscribe(
      (response) => {
        this.assetUsageName = response['Descr'];
      }
    );
  }

  getOwnerProfessionDesc(Code: string){
    let reqByCode: GenericObj = new GenericObj();
    reqByCode.Code = Code;
    this.http.post(URLConstant.GetRefProfessionByCode, reqByCode).subscribe(
      (response) => {
        this.ownerProfessionName = response['ProfessionName'];
      }
    );
  }

  getAssetConditionDesc(Code: string){
    let reqByCode: GenericObj = new GenericObj();
    reqByCode.Code = Code;
    this.http.post(URLConstant.GetRefMasterByMasterCode, reqByCode).subscribe(
      (response) => {
        this.assetCondition = response['Descr'];
      }
    );
  }

  getAssetUserRelationshipDesc(Code: string){
    let reqByCode: GenericObj = new GenericObj();
    reqByCode.Code = Code;
    this.http.post(URLConstant.GetRefMasterByMasterCode, reqByCode).subscribe(
      (response) => {
        this.assetUserRelationship = response['Descr'];
      }
    );
  }

  getAssetType(Code: string){
    let reqByCode: GenericObj = new GenericObj();
    reqByCode.Code = Code;
    this.http.post(URLConstant.GetAssetTypeByCode, reqByCode).subscribe(
      (response: any) => {
        this.AssetTypeObj = response;
      }
    );
  }

  getCollateralAccData(){
    this.http.post<Array<AppCollateralAccessoryObj>>(URLConstant.GetAppCollateralAccessoriesListByAppCollateralId, {Id: this.appCollateralRegistration.AppCollateralId }).subscribe(
      (response) => {
        this.AppCollateralAccessoryObjs = response[CommonConstant.ReturnObj];
        
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = this.AppCollateralAccessoryObjs;
      }
    );
  }
}
