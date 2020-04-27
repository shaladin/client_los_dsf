import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { forEach } from '@angular/router/src/utils/collection';
import { NegativeAssetCheckForMultiAssetObj } from 'app/shared/model/NegativeAssetCheckForMultiAssetObj.Model';
import { NegativeAssetCheckObj } from 'app/shared/model/NegativeAssetCheckObj.Model';

@Component({
  selector: 'app-negative-asset-multi-asset',
  templateUrl: './negative-asset-multi-asset.component.html' 
})
export class NegativeAssetMultiAssetComponent implements OnInit {

  constructor(  private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
    });
    this.getAppAssetListByAppIdUrl = AdInsConstant.GetAppAssetListByAppId;
    this.getAssetNegativeDuplicateCheckByListOfAssetUrl = AdInsConstant.GetAssetNegativeDuplicateCheckByListOfAsset;
  }
  appAssetObj: any;
  getAppAssetListByAppIdUrl: string;
  getAssetNegativeDuplicateCheckByListOfAssetUrl: string;
  AppId : any;
  listAssetData : any;
  negativeAssetCheckForMultiAssetObj : any;
  negativeAssetCheckObj : any;
  listAssetNegative : any;
  ngOnInit() {
  console.log(this.AppId);
  this.appAssetObj = new AppAssetObj();
  this.negativeAssetCheckForMultiAssetObj = new NegativeAssetCheckForMultiAssetObj();
  this.negativeAssetCheckForMultiAssetObj.RequestObj = new Array<NegativeAssetCheckObj>();
  this.appAssetObj.AppId = this.AppId;
  this.http.post(this.getAppAssetListByAppIdUrl, this.appAssetObj).subscribe(
    response => {
      console.log(response);
      this.listAssetData = response["ReturnObject"];
     
      for (var i = 0; i < this.listAssetData.length; i++) {
        this.negativeAssetCheckObj = new NegativeAssetCheckObj(); 
            this.negativeAssetCheckObj.AssetTypeCode = this.listAssetData[i].AssetTypeCode; 
            this.negativeAssetCheckObj.SerialNo1 = this.listAssetData[i].SerialNo1;
            this.negativeAssetCheckObj.SerialNo2 = this.listAssetData[i].SerialNo2;
            this.negativeAssetCheckObj.SerialNo3 = this.listAssetData[i].SerialNo3;
            this.negativeAssetCheckObj.SerialNo4 = this.listAssetData[i].SerialNo4;
            this.negativeAssetCheckObj.SerialNo5 = this.listAssetData[i].SerialNo5;
            this.negativeAssetCheckForMultiAssetObj.RequestObj[i] = this.negativeAssetCheckObj;
            console.log(this.negativeAssetCheckForMultiAssetObj); 
    } 
    this.http.post(this.getAssetNegativeDuplicateCheckByListOfAssetUrl, this.negativeAssetCheckForMultiAssetObj).subscribe(
      response => { 
        this.listAssetNegative = response["ReturnObject"];
      });



    },
    error => {
        console.log("error")
    }
  );

  }

}
