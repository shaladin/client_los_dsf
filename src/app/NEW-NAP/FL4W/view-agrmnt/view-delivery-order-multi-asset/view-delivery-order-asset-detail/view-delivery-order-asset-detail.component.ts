import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';

@Component({
  selector: 'app-view-delivery-order-asset-detail',
  templateUrl: './view-delivery-order-asset-detail.component.html',
  styleUrls: ['./view-delivery-order-asset-detail.component.scss']
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
    this.GetAllAssetDataByAppAssetId = AdInsConstant.GetAllAssetDataByAppAssetId;
    this.GetListAppCollateralForDOView = AdInsConstant.GetListAppCollateralForDOView;
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
