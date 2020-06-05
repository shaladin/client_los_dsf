import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppAssetDataDetailComponent } from './app-asset-data-detail/app-asset-data-detail.component';

@Component({
  selector: 'app-app-asset-data',
  templateUrl: './app-asset-data.component.html',
  styles: []
})
export class AppAssetDataComponent implements OnInit {
  @Input() AppId: number;
  appAssetList: Array<any>;
  appCollateralList: Array<any>;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    var request = { AppId: this.AppId };
    let getAppAsset = this.httpClient.post(AdInsConstant.GetAppAssetListByAppId, request);
    let getAppCollateral = this.httpClient.post(AdInsConstant.GetViewAppCollateralObjByAppId, request);
    forkJoin([getAppAsset, getAppCollateral]).subscribe(
      (response) => {
        this.appAssetList = response[0]["ReturnObject"];
        this.appCollateralList = response[1]["AppCollateralObjs"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  viewDetailHandler(appAssetId){
    // console.log("assethandler")
    // console.log(appAssetId)
    // console.log(this.AppId)
    const modalAssetDetail = this.modalService.open(AppAssetDataDetailComponent);
    modalAssetDetail.componentInstance.AppAssetId = appAssetId;
    modalAssetDetail.componentInstance.AppId = this.AppId;
    modalAssetDetail.result.then().catch((error) => {
      if(error != 0){
        console.log(error);
      }
    });
  }

}
