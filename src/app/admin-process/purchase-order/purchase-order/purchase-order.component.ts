import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {

  AgrmntId: any;
  arrValue = [];
  AppAssetList = [];
  constructor(private route: ActivatedRoute, private http: HttpClient) { 
    this.route.queryParams.subscribe(params => {
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
    });}

  ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    var appAssetObj = {
      AgrmntId: this.AgrmntId
    }
    this.http.post(AdInsConstant.GetAppAssetListByAgrmntId, appAssetObj).subscribe(
      (response) => {
        console.log(response);  
      },
      (error) => {
        console.log(error);
      }
    );
  }
}