import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { AppAssetSupplEmpObj } from 'app/shared/model/AppAssetSupplEmpObj.Model';
import { forkJoin } from 'rxjs';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-app-asset-data-detail-fl4w',
  templateUrl: './app-asset-data-detail-fl4w.component.html'
})
export class AppAssetDataDetailFl4wComponent implements OnInit {
  @Input() AppAssetId: number;
  @Input() AgrmntId: number;
  appAsset: any;
  appAssetSupplEmp: any;
  appCollateralRegistration: any;
  salesName: string;
  branchManagerName: string;
  adminHeadName: string;

  constructor(
    private httpClient: HttpClient,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    let getAppAsset = this.httpClient.post(URLConstant.GetAppAssetByAppAssetIdWithSerialNoDefinition, { AppAssetId: this.AppAssetId });
    let getAppAssetSupplEmp = this.httpClient.post(URLConstant.GetListAppAssetSupplEmpByAppAssetId, { AppAssetId: this.AppAssetId });
    let getAppCollReg = this.httpClient.post(URLConstant.GetAppCollateralRegistrationByAgrmntId, { AgrmntId: this.AgrmntId });
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
      });
  }

}
