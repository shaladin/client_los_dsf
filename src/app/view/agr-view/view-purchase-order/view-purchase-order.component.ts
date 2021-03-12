import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-purchase-order',
  templateUrl: './view-purchase-order.component.html'
})
export class ViewPurchaseOrderComponent implements OnInit {
  @Input() agrmntId: number = 0;
  ResponseAgrmntFinDataData: any;
  ResponseAppAssetData: any;
  ResponsePurchaseOrderHData: any;
  AssetTypeObj: any;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    await this.BindPOData();
  }

  async BindPOData(){
    var obj = { AgrmntId: this.agrmntId };
    await this.http.post(URLConstant.GetPurchaseOrderHDetailViewByAgrmntId, obj).toPromise().then(
      (response) => {
        this.ResponseAgrmntFinDataData = response["ResponseAgrmntFinDataObj"];
        this.ResponseAppAssetData = response["ResponseAppAssetObj"];
        this.ResponsePurchaseOrderHData = response["ResponsePurchaseOrderHObj"];
      }
    );

    this.http.post(URLConstant.GetAssetTypeByCode, { AssetTypeCode: this.ResponseAppAssetData.AssetTypeCode }).subscribe(
      (response: any) => {
        this.AssetTypeObj = response;
      }
    );
  }
}