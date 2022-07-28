import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ViewAssetDataDetailXComponent } from './view-asset-data-detail/view-asset-data-detail-x.component';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';

@Component({
  selector: 'view-multiasset-data',
  templateUrl: './view-multiasset-data.component.html'
})
export class ViewMultiassetDataComponent implements OnInit {
  @Input() AppId: number = 0;
  @Input() AgrmntId: number = 0;
  @Input() BizTemplateCode: string;
  appAssetList: Array<any>;
  appCollateralList: Array<any>;
  IsHidden: boolean = true;
  AppCollateralId: number;
  SerialNoLabelCollateralList: Array<string> = [];

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    if(this.AppId != 0){
      this.GetAssetByAppId();
    }

    if(this.AgrmntId != 0){
      this.GetAssetByAgrmntId();
    }
  }

  async GetAssetByAppId() {
    let request = { Id: this.AppId };
    let getAppAsset = this.http.post(URLConstant.GetAppAssetListByAppId, request);
    let getAppCollateral = this.http.post(URLConstant.GetViewAppCollateralObjByAppId, request);
    await forkJoin([getAppAsset, getAppCollateral]).toPromise().then(
      (response) => {
        this.appAssetList = response[0][CommonConstant.ReturnObj];
        this.appCollateralList = response[1]["AppCollateralObjs"];
      }
    );
    await this.GetSerialNoList();
  }

  async GetAssetByAgrmntId() {
    let request = { Id: this.AgrmntId };
    let getAppAsset = this.http.post<Array<AppAssetObj>>(URLConstant.GetAppAssetListByAgrmntIdForViewAgrmnt, request);
    let getAppCollateral = this.http.post<Array<AppCollateralObj>>(URLConstant.GetListAppCollateralByAgrmntId, request);
    await forkJoin([getAppAsset, getAppCollateral]).toPromise().then(
      (response) => {
        this.appAssetList = response[0][CommonConstant.ReturnObj];
        this.appCollateralList = response[1][CommonConstant.ReturnObj];

        if(this.appAssetList.length > 0) {
          this.AppId = this.appAssetList[0]['AppId'];
        }
      }
    );
    await this.GetSerialNoList();
  }

  async GetSerialNoList()
  {
    let reqByListCodes: GenericListByCodeObj = new GenericListByCodeObj();

    this.appCollateralList.forEach(x => {
      reqByListCodes.Codes.push(x.AssetTypeCode);
    });
    
    let x = [];
    let temp = 0;
    for(let i = 0; i < reqByListCodes.Codes.length; i++)
    {
      await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
        Code: this.appCollateralList[i].AssetTypeCode
      }).toPromise().then(
        (response) => {
          if(i == 0)
          {
            response[CommonConstant.ReturnObj].length <= 3? temp = response[CommonConstant.ReturnObj].length : temp = 3;
          }
          else
          {
            response[CommonConstant.ReturnObj].length >= temp? (response[CommonConstant.ReturnObj].length >= 3? temp = 3 : temp = response[CommonConstant.ReturnObj].length) : temp = temp;
          }
        });

      x = reqByListCodes.Codes.filter(f => f == reqByListCodes.Codes[i]);
    }

    if(x.length == reqByListCodes.Codes.length)
    {
      await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
        Code: this.appCollateralList[0].AssetTypeCode
      }).toPromise().then(
        (response) => {
          for(let i = 0; i < temp; i++)
          {
            this.SerialNoLabelCollateralList.push(response[CommonConstant.ReturnObj][i].SerialNoLabel)
          }
        });
    }
    else
    {
      for(let i = 0; i < temp; i++)
      {
        this.SerialNoLabelCollateralList.push("Serial No " + (i+1))
      }
    }
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
