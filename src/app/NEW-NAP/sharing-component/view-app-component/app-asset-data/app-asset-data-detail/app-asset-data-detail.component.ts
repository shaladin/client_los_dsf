import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { AppAssetSupplEmpObj } from 'app/shared/model/AppAssetSupplEmpObj.Model';
import { forkJoin } from 'rxjs';

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
  salesName: string;
  branchManagerName: string;
  adminHeadName: string;

  constructor(
    private httpClient: HttpClient,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    let getAppAsset = this.httpClient.post(AdInsConstant.GetAppAssetByAppAssetIdWithSerialNoDefinition, { AppAssetId: this.AppAssetId });
    let getAppAssetSupplEmp = this.httpClient.post(AdInsConstant.GetListAppAssetSupplEmpByAppAssetId, { AppAssetId: this.AppAssetId });
    let getAppCollReg = this.httpClient.post(AdInsConstant.GetAppCollateralRegistrationByAppId, { AppId: this.AppId });
    forkJoin([getAppAsset, getAppAssetSupplEmp, getAppCollReg]).subscribe(
      (response: any) => {
        this.appAsset = response[0];
        this.appAssetSupplEmp = response[1];
        this.appCollateralRegistration = response[2];

        for (const item of this.appAssetSupplEmp.ReturnObject) {
          if(item.MrSupplEmpPositionCode == "SALES_PERSON"){
            this.salesName = item.SupplEmpName;
          }
          else if(item.MrSupplEmpPositionCode == "BRANCH_MANAGER"){
            this.branchManagerName = item.SupplEmpName;
          }
          else if(item.MrSupplEmpPositionCode == "ADMIN_HEAD"){
            this.adminHeadName = item.SupplEmpName;
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
