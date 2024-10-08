import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { AssetTypeObj } from 'app/shared/model/asset-type-obj.model';
import { AppCollateralRegistrationObj } from 'app/shared/model/app-collateral-registration-obj.model';
import { AppAssetSupplEmpObj } from 'app/shared/model/app-asset-suppl-emp-obj.model';

@Component({
  selector: 'app-app-asset-data-detail-fl4w',
  templateUrl: './app-asset-data-detail-fl4w.component.html'
})
export class AppAssetDataDetailFl4wComponent implements OnInit {
  @Input() AppAssetId: number;
  @Input() AgrmntId: number;
  appAsset: AppAssetObj;
  appAssetSupplEmp: Array<AppAssetSupplEmpObj>;
  appCollateralRegistration: AppCollateralRegistrationObj;
  AssetTypeObj: AssetTypeObj;
  salesName: string;
  branchManagerName: string;
  adminHeadName: string;

  constructor(private httpClient: HttpClient, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    let getAppAsset = this.httpClient.post(URLConstant.GetAppAssetByAppAssetIdWithSerialNoDefinition, { Id: this.AppAssetId });
    let getAppAssetSupplEmp = this.httpClient.post(URLConstant.GetListAppAssetSupplEmpByAppAssetId, { Id: this.AppAssetId });
    let getAppCollReg = this.httpClient.post(URLConstant.GetAppCollateralRegistrationByAgrmntId, { Id: this.AgrmntId });
    forkJoin([getAppAsset, getAppAssetSupplEmp, getAppCollReg]).subscribe(
      (response: any) => {
        this.appAsset = response[0];
        this.appAssetSupplEmp = response[1].ReturnObject;
        this.appCollateralRegistration = response[2];

        for (const item of this.appAssetSupplEmp) {
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
      }
    );

    this.httpClient.post(URLConstant.GetAssetTypeByCode, {Code: this.appAsset.AssetTypeCode }).subscribe(
      (response: AssetTypeObj) => {
        this.AssetTypeObj = response;
      }
    );
  }
}
