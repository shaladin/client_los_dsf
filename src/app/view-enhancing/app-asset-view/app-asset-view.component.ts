import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-app-asset-view',
  templateUrl: './app-asset-view.component.html',
  styleUrls: []
})
export class AppAssetViewComponent implements OnInit {
  AppId: number;
  AppAssetId: number;
  BizTemplateCode: string;
  isReady: boolean = false;
  IsAssetDetail: boolean = true;
  IsAssetExpense: boolean = true;
  IsFinancialData: boolean = true;
  
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  constructor(private route: ActivatedRoute,
    private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AppAssetId"] != null) {
        this.AppAssetId = params["AppAssetId"];
      }
    });
  }

  async ngOnInit() {
    await this.SetMainInfo();
    await this.GetApp();
    
    this.isReady = true;
  }

  async GetApp() {
    var appObj = {
      AppId: this.AppId,
    };

    await this.http.post(URLConstant.GetAppById, appObj).toPromise().then(
      (response) => {
        this.BizTemplateCode = response["BizTemplateCode"];
      }
    );
  }

  async SetMainInfo() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/view/app-asset-view/view-application-asset-main-information.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
  }

  getCallBack(event) {
    if(event.Key === "Application") {
      AdInsHelper.OpenAppViewByAppId(event.ViewObj.AppId);
    }
  }
}