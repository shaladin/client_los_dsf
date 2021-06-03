import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AllAssetDataObj } from 'app/shared/model/AllAssetDataObj.Model';

@Component({
  selector: "view-asset-data",
  templateUrl: "./view-asset-data.component.html"
})
export class ViewAssetDataComponent implements OnInit {
  getAppUrl: string;
  getAllAssetDataUrl: string;
  @Input() appId: number = 0;
  appAssetId: number = 0;
  appObj = {
    Id: 0
  };
  appAssetObj = {
    Id: 0
  };

  AppObj: any;
  AppAssetObj: AllAssetDataObj;
  totalRsvFund: number = 0;
  totalHalfResponseAppAssetAttrObjs: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
     if (params['AppId'] != null) {
       this.appId = params['AppId'];
     }
     if (params['AppAssetId'] != null) {
      this.appAssetId = params['AppAssetId'];
    }
    });
  }

  initUrl() {
    this.getAppUrl = URLConstant.GetAppById;
    this.getAllAssetDataUrl = URLConstant.GetAllAssetDataByAppId;
  }

  initSingleAssetUrl(){
    this.getAppUrl = URLConstant.GetAppById;
    this.getAllAssetDataUrl = URLConstant.GetAllAssetDataByAppAssetId;
  }

  async ngOnInit(): Promise<void> {
    if (this.appAssetId != 0) {
      this.initSingleAssetUrl();
      this.appAssetObj.Id = this.appAssetId;
      await this.GetAllAssetData(this.appAssetObj);
    }
    else {
      this.initUrl();
      this.appObj.Id = this.appId;
      await this.GetAllAssetData(this.appObj);
    }
  }

  async GetAllAssetData(obj: any) {
    await this.http.post(this.getAllAssetDataUrl, obj).toPromise().then(
      (response: AllAssetDataObj) => {
        this.AppAssetObj = response;
        if(this.AppAssetObj.AppAssetAttrObj != null) {
          this.totalHalfResponseAppAssetAttrObjs = Math.ceil(this.AppAssetObj.AppAssetAttrObj.length/2);
        }
      }
    );
  }
}