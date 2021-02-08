import { Component, OnInit, Input } from '@angular/core';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-asset-opl-main-info',
  templateUrl: './asset-opl-main-info.component.html'
})
export class AssetOplMainInfoComponent implements OnInit {

  @Input() AppAssetId : number=0;
  isReady: boolean = false;
  AppAssetObj: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.post(URLConstant.GetAppAssetOplMainInfoByAppAssetId, { AppAssetId: this.AppAssetId }).subscribe(
      (response) => {
        this.AppAssetObj = response;
        this.isReady = true;
      }
    );
  }


}
