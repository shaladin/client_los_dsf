import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppAssetDataDetailComponent } from './app-asset-data-detail/app-asset-data-detail.component';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';
import { AssetTypeObj } from 'app/shared/model/asset-type-obj.model';

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
  MostSerialNoAssetType: AssetTypeObj = new AssetTypeObj();
  MostSerialNoCollateralType: AssetTypeObj = new AssetTypeObj();
  SerialNoLabelAssetList: Array<string> = [];
  SerialNoLabelCollateralList: Array<string> = [];
  tempSerialNoLabelCollateralList: Array<string> = [];

  constructor(private httpClient: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    var request = { Id: this.AppId };
    let getAppAsset = this.httpClient.post(URLConstant.GetAppAssetListByAppId, request);
    let getAppCollateral = this.httpClient.post(URLConstant.GetViewAppCollateralObjByAppId, request);
    forkJoin([getAppAsset, getAppCollateral]).subscribe(
      (response) => {
        this.appAssetList = response[0][CommonConstant.ReturnObj];
        this.appCollateralList = response[1]["AppCollateralObjs"];
        this.checkListAssetType();
        this.checkListCollType();
      }
    );
  }

  checkListAssetType(){
    let reqByListCodes: GenericListByCodeObj = new GenericListByCodeObj();
    reqByListCodes.Codes = Array.from(new Set(this.appAssetList.map(x => x.AssetTypeCode)));
    this.httpClient.post(URLConstant.GetMostSerialNoAssetTypeByListAssetTypeCode, reqByListCodes).subscribe(
      (response: AssetTypeObj) => {
        this.MostSerialNoAssetType = response;
        this.MostSerialNoAssetType.SerialNo1Label != null? this.SerialNoLabelAssetList.push(this.MostSerialNoAssetType.SerialNo1Label) : null;
        this.MostSerialNoAssetType.SerialNo2Label != null? this.SerialNoLabelAssetList.push(this.MostSerialNoAssetType.SerialNo2Label) : null;
        this.MostSerialNoAssetType.SerialNo3Label != null? this.SerialNoLabelAssetList.push(this.MostSerialNoAssetType.SerialNo3Label) : null;
        this.MostSerialNoAssetType.SerialNo4Label != null? this.SerialNoLabelAssetList.push(this.MostSerialNoAssetType.SerialNo4Label) : null;
        this.MostSerialNoAssetType.SerialNo5Label != null? this.SerialNoLabelAssetList.push(this.MostSerialNoAssetType.SerialNo5Label) : null;
      }
    );
  }

  async checkListCollType(){
    let reqByListCodes: GenericListByCodeObj = new GenericListByCodeObj();
    reqByListCodes.Codes = Array.from(new Set(this.appCollateralList.map(x => x.AssetTypeCode)));

    let x = [];
    let temp = 0;
    for(let i = 0; i < reqByListCodes.Codes.length; i++)
    {
      await this.httpClient.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
        Code: reqByListCodes.Codes[i]
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
      await this.httpClient.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
        Code: reqByListCodes.Codes[0]
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