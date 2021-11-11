import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ViewAssetDataDetailXComponent } from './view-asset-data-detail/view-asset-data-detail-x.component';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';

@Component({
  selector: 'view-asset-data-x',
  templateUrl: './view-asset-data-x.component.html'
})
export class ViewAssetDataXComponent implements OnInit {
  @Input() AppId: number = 0;
  @Input() AgrmntId: number = 0;
  @Input() BizTemplateCode: string;
  appAssetList: Array<any>;
  appCollateralList: Array<any>;
  IsHidden: boolean = true;
  AppCollateralId: number;

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    if(this.AppId != 0){
      this.GetAssetByAppId();
    }

    if(this.AgrmntId != 0){
      this.GetAssetByAgrmntId();
    }
  }

  GetAssetByAppId() {
    let request = { Id: this.AppId };
    let getAppAsset = this.http.post(URLConstant.GetAppAssetListByAppId, request);
    let getAppCollateral = this.http.post(URLConstant.GetViewAppCollateralObjByAppId, request);
    forkJoin([getAppAsset, getAppCollateral]).subscribe(
      (response) => {
        this.appAssetList = response[0][CommonConstant.ReturnObj];
        this.appCollateralList = response[1]["AppCollateralObjs"];
      }
    );
  }

  GetAssetByAgrmntId() {
    let request = { Id: this.AgrmntId };
    let getAppAsset = this.http.post<Array<AppAssetObj>>(URLConstant.GetAppAssetListByAgrmntIdForViewAgrmnt, request);
    let getAppCollateral = this.http.post<Array<AppCollateralObj>>(URLConstant.GetListAppCollateralByAgrmntId, request);
    forkJoin([getAppAsset, getAppCollateral]).subscribe(
      (response) => {
        this.appAssetList = response[0][CommonConstant.ReturnObj];
        this.appCollateralList = response[1][CommonConstant.ReturnObj];

        if(this.appAssetList.length > 0) {
          this.AppId = this.appAssetList[0]['AppId'];
        }
      }
    );
  }


  viewDetailHandler(appAssetId, i){
    const modalAssetDetail = this.modalService.open(ViewAssetDataDetailXComponent);
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
