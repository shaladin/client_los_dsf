import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss']
})
export class PurchaseOrderDetailComponent implements OnInit {

  arrValue = [];
  AgrmntId: any;
  AppId: any;
  AppAssetId: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AppAssetId"] != null) {
        this.AppAssetId = params["AppAssetId"];
      }
    });
  }

  ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    var appAssetObj = {
      AppId: this.AppId
    }
    this.http.post(AdInsConstant.GetAppAssetByAppId, appAssetObj).subscribe(
      (response) => {
        console.log(response);  
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
