import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { ViewAssetCollateralDetailComponent } from './view-asset-collateral-detail/view-asset-collateral-detail.component';

@Component({
  selector: 'view-asset-collateral',
  templateUrl: './view-asset-collateral.component.html'
})
export class ViewAssetCollateralComponent implements OnInit {

  @Input() agrmntId: number = 0;
  @Input() appId: number = 0;
  appAssetList: Array<AppAssetObj> = new Array<AppAssetObj>();
  AppCollateralObj: Array<AppCollateralObj> = new Array<AppCollateralObj>();

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    var AgrmntObj = {
      AgrmntId: this.agrmntId
    }
    this.http.post<Array<AppAssetObj>>(URLConstant.GetAppAssetListByAgrmntIdForViewAgrmnt, AgrmntObj).subscribe(
      (response) => {
        this.appAssetList = response[CommonConstant.ReturnObj];
        if(this.appAssetList.length > 0) {
          this.appId = this.appAssetList[0]['AppId'];
        }
      });

    this.http.post<Array<AppCollateralObj>>(URLConstant.GetListAppCollateralByAgrmntId, {AgrmntId: this.agrmntId}).subscribe(
      (response) => {
        this.AppCollateralObj = response[CommonConstant.ReturnObj];
      });
  }

  viewDetailHandler(appAssetId) {
    const modalAssetDetail = this.modalService.open(ViewAssetCollateralDetailComponent);
    modalAssetDetail.componentInstance.AppAssetId = appAssetId;
    modalAssetDetail.componentInstance.AgrmntId = this.agrmntId;
    modalAssetDetail.componentInstance.AppId = this.appId;
    modalAssetDetail.result.then().catch((error) => {
    });
  }
}
