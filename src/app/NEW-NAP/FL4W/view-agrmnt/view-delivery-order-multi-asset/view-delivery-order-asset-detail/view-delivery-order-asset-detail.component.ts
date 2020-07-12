import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-delivery-order-asset-detail',
  templateUrl: './view-delivery-order-asset-detail.component.html'
})
export class ViewDeliveryOrderAssetDetailComponent implements OnInit {
  GetAllAssetDataByAppAssetId: string;
  assetData: any;
  inputGridObj: any;
  @Input() AppAssetId : number;
  GetListAppCollateralForDOView: string;
  doList: Array<any>;
  constructor(private route: ActivatedRoute, private http: HttpClient) {

  }

  async ngOnInit(){
    this.GetAllAssetDataByAppAssetId = URLConstant.GetAllAssetDataByAppAssetId;
    this.GetListAppCollateralForDOView = URLConstant.GetListAppCollateralForDOView;
    var assetObj = { "AppAssetId" : this.AppAssetId};

    this.http.post(this.GetAllAssetDataByAppAssetId, assetObj).subscribe(
      (response) => { 
       this.assetData = response;
      });

    this.http.post(this.GetListAppCollateralForDOView, assetObj).subscribe(
      (response) => { 
        this.doList = response['ReturnObject'];
      });
  }

}
