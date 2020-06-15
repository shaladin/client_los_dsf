import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppAssetDataDetailComponent } from 'app/NEW-NAP/sharing-component/view-app-component/app-asset-data/app-asset-data-detail/app-asset-data-detail.component';


@Component({
  selector: 'app-app-asset-data-fl4w',
  templateUrl: './app-asset-data-fl4w.component.html',
  styleUrls: ['./app-asset-data-fl4w.component.scss']
})
export class AppAssetDataFl4wComponent implements OnInit {
  @Input() AgrmntId: number;
  appAssetList: Array<any>;
  appCollateralList: Array<any>;
  AppId: any;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    var request = { AgrmntId: this.AgrmntId };
    let getAppAsset = this.httpClient.post(AdInsConstant.GetAppAssetListByAgrmntId, request);
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
