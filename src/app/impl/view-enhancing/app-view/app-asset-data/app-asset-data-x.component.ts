import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppAssetDataDetailXComponent } from './app-asset-data-detail/app-asset-data-detail-x.component';

@Component({
  selector: 'app-app-asset-data-x',
  templateUrl: './app-asset-data-x.component.html'
})
export class AppAssetDataXComponent implements OnInit {
  @Input() AppId: number;
  @Input() BizTemplateCode: string;
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

  viewDetailHandler(appAssetId, i){
    const modalAssetDetail = this.modalService.open(AppAssetDataDetailXComponent);
    modalAssetDetail.componentInstance.AppAssetId = appAssetId;
    modalAssetDetail.componentInstance.AppId = this.AppId;
    modalAssetDetail.componentInstance.BizTemplateCode = this.BizTemplateCode;
    modalAssetDetail.componentInstance.AppCollateralId = this.appCollateralList[i].AppCollateralId;
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
