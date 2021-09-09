import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-app-asset-data-detail',
  templateUrl: './app-asset-data-detail.component.html',
  styles: []
})
export class AppAssetDataDetailComponent implements OnInit {
  @Input() AppAssetId: number;
  @Input() AppId: number;
  appAsset: any;
  appAssetSupplEmp: any;
  appCollateralRegistration: any;
  AssetTypeObj: any;
  salesName: string;
  branchManagerName: string;
  adminHeadName: string;
  assetUsageName: string;
  assetCondition: string;
  assetUserRelationship: string;
  inputGridObj: InputGridObj = new InputGridObj();

  constructor(private httpClient: HttpClient, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.inputGridObj.pagingJson = "./assets/ucgridview/app-view/gridAppAssetAccessoryFL4W.json";

    let getAppAsset = this.httpClient.post(URLConstant.GetAppAssetByAppAssetIdWithSerialNoDefinition, { Id: this.AppAssetId });
    let getAppAssetSupplEmp = this.httpClient.post(URLConstant.GetListAppAssetSupplEmpByAppAssetId, { Id: this.AppAssetId });
    let getAppCollReg = this.httpClient.post(URLConstant.GetAppCollateralRegistrationByAppId, { Id: this.AppId });
    forkJoin([getAppAsset, getAppAssetSupplEmp, getAppCollReg]).subscribe(
      (response: any) => {
        this.appAsset = response[0];
        this.appAssetSupplEmp = response[1];
        this.appCollateralRegistration = response[2];

        for (const item of this.appAssetSupplEmp.ReturnObject) {
          if(item.MrSupplEmpPositionCode == CommonConstant.SALES_JOB_CODE){
            this.salesName = item.SupplEmpName;
          }
          else if(item.MrSupplEmpPositionCode == CommonConstant.BRANCH_MANAGER_JOB_CODE){
            this.branchManagerName = item.SupplEmpName;
          }
          else if(item.MrSupplEmpPositionCode == CommonConstant.ADMIN_HEAD_JOB_CODE){
            this.adminHeadName = item.SupplEmpName;
          }
        }

        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = this.appAsset.ResponseAppAssetAccessoryObjs;

        this.getAssetConditionDesc(this.appAsset.MrAssetConditionCode);
        this.getAssetUsageDesc(this.appAsset.MrAssetUsageCode);
        this.getAssetUserRelationshipDesc(this.appCollateralRegistration.MrUserRelationshipCode);
        this.getAssetType(this.appAsset.AssetTypeCode);
      }
    );
  }

  getAssetUsageDesc(Code: string){
    let reqByCode: GenericObj = new GenericObj();
    reqByCode.Code = Code;
    this.httpClient.post(URLConstant.GetRefMasterByMasterCode, reqByCode).subscribe(
      (response) => {
        this.assetUsageName = response['Descr'];
      }
    );
  }

  getAssetConditionDesc(Code: string){
    let reqByCode: GenericObj = new GenericObj();
    reqByCode.Code = Code;
    this.httpClient.post(URLConstant.GetRefMasterByMasterCode, reqByCode).subscribe(
      (response) => {
        this.assetCondition = response['Descr'];
      }
    );
  }

  getAssetUserRelationshipDesc(Code: string){
    let reqByCode: GenericObj = new GenericObj();
    reqByCode.Code = Code;
    this.httpClient.post(URLConstant.GetRefMasterByMasterCode, reqByCode).subscribe(
      (response) => {
        this.assetUserRelationship = response['Descr'];
      }
    );
  }

  getAssetType(Code: string){
    let reqByCode: GenericObj = new GenericObj();
    reqByCode.Code = Code;
    this.httpClient.post(URLConstant.GetAssetTypeByCode, reqByCode).subscribe(
      (response: any) => {
        this.AssetTypeObj = response;
      }
    );
  }
}
