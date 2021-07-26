import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppAssetOplObj } from 'app/shared/model/AppAssetOplObj.Model';

@Component({
  selector: 'app-asset-opl-main-info',
  templateUrl: './asset-opl-main-info.component.html'
})
export class AssetOplMainInfoComponent implements OnInit {
  @Input() AppAssetId : number=0;
  isReady: boolean = false;
  AppAssetObj: AppAssetOplObj;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.post(URLConstant.GetAppAssetOplMainInfoByAppAssetId, { Id: this.AppAssetId }).subscribe(
      (response: AppAssetOplObj) => {
        this.AppAssetObj = response;
        this.isReady = true;
      }
    );
  }
}