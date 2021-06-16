import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppAssetDataDetailComponent } from './app-asset-data-detail/app-asset-data-detail.component';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-app-asset-data',
  templateUrl: './app-asset-data.component.html',
  styles: []
})
export class AppAssetDataComponent implements OnInit {
  @Input() AppId: number;
  appAssetList: Array<any>;
  appCollateralList: Array<any>;
  IsHidden: boolean = true;
  AppCollateralId: number;

  constructor(private httpClient: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    var request = { Id: this.AppId };
    let getAppAsset = this.httpClient.post(URLConstant.GetAppAssetListByAppId, request);
    let getAppCollateral = this.httpClient.post(URLConstant.GetViewAppCollateralObjByAppId, request);
    forkJoin([getAppAsset, getAppCollateral]).subscribe(
      (response) => {
        this.appAssetList = response[0][CommonConstant.ReturnObj];
        this.appCollateralList = response[1]["AppCollateralObjs"];
      }
    );
  }

  viewDetailHandler(appAssetId){
    const modalAssetDetail = this.modalService.open(AppAssetDataDetailComponent);
    modalAssetDetail.componentInstance.AppAssetId = appAssetId;
    modalAssetDetail.componentInstance.AppId = this.AppId;
    modalAssetDetail.result.then().catch((error) => {
    });
  }

  viewDetailCollateralHandler(AppCollateralId){
    this.IsHidden = false;
    this.AppCollateralId = AppCollateralId;
  }

  getValue(event){
    this.IsHidden = event;
  }
}