import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AssetTypeObj } from 'app/shared/model/AssetTypeObj.Model';

@Component({
  selector: 'app-view-delivery-order-asset-detail',
  templateUrl: './view-delivery-order-asset-detail.component.html'
})
export class ViewDeliveryOrderAssetDetailComponent implements OnInit {
  assetData: any;
  @Input() AppAssetId : number;
  doList: Array<any>;
  AssetTypeObj: AssetTypeObj;

  constructor(private http: HttpClient) { }

  async ngOnInit(){
    var assetObj = { "Id": this.AppAssetId };

    this.http.post(URLConstant.GetAllAssetDataByAppAssetId, assetObj).subscribe((response) => { 
      this.assetData = response;

      this.http.post(URLConstant.GetAssetTypeByCode, {Code: this.assetData.ResponseAppCollateralObj.AssetTypeCode }).subscribe(
        (response: AssetTypeObj) => {
          this.AssetTypeObj = response;
        }
      );
    });

    this.http.post(URLConstant.GetListAppCollateralForDOView, assetObj).subscribe(
      (response) => { 
        this.doList = response['ReturnObject'];
      }
    );
  }
}