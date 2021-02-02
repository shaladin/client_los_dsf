import { Component, OnInit, Input } from '@angular/core';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-app-asset-view-asset-info',
  templateUrl: './app-asset-view-asset-info.component.html',
  styleUrls: []
})
export class AppAssetViewAssetInfoComponent implements OnInit {
  @Input() AppAssetId: number;
  @Input() BizTemplateCode: string;
  
  AccessoriesList: Array<any> = new Array<any>();

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    await this.SetInfo();
    await this.SetAccessoriesList();
  }

  async SetInfo() {
    if(this.BizTemplateCode === CommonConstant.OPL) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/view/app-asset-view/view-application-asset-asset-information.json";
      this.viewGenericObj.viewEnvironment = environment.losUrl;
    }
  }

  async SetAccessoriesList() {
    var requestAppAssetId = {
      AppAssetId: this.AppAssetId
    };

    await this.http.post(URLConstant.GetListAppAssetAccessoryByAppAssetId, requestAppAssetId).toPromise().then(
      (response) => {
        this.AccessoriesList = response["ReturnObject"];
      }
    );
  }
}