import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'view-asset-collateral-detail',
  templateUrl: './view-asset-collateral-detail.component.html',
  styles: []
})
export class ViewAssetCollateralDetailComponent implements OnInit {
  @Input() AppAssetId: number;
  @Input() AppId: number;
  appAsset: any;
  appAssetSupplEmp: any;
  appCollateralRegistration: any;
  AssetTypeObj: any;
  salesName: string;
  branchManagerName: string;
  adminHeadName: string;

  constructor(private httpClient: HttpClient,
    public activeModal: NgbActiveModal) { }

  ngOnInit() {
    let getAppAsset = this.httpClient.post(URLConstant.GetAppAssetByAppAssetIdWithSerialNoDefinition, { AppAssetId: this.AppAssetId });
    let getAppAssetSupplEmp = this.httpClient.post(URLConstant.GetListAppAssetSupplEmpByAppAssetId, { Id: this.AppAssetId });
    let getAppCollReg = this.httpClient.post(URLConstant.GetAppCollateralRegistrationByAppId, { AppId: this.AppId });
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
      }
    );

    this.httpClient.post(URLConstant.GetAssetTypeByCode, { AssetTypeCode: this.appAsset.AssetTypeCode }).subscribe(
      (response: any) => {
        this.AssetTypeObj = response;
      }
    );
  }
}