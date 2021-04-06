import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-app-list-view',
  templateUrl: './app-list-view.component.html',
  styleUrls: []
})
export class AppListViewComponent implements OnInit {
  CustId: number;

  CustNo: string;

  isReady: boolean = false;
  
  AppList: Array<any> = new Array<any>();
  AppOplList: Array<any> = new Array<any>();

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["CustId"] != null) {
        this.CustId = params["CustId"];
      }
      if (params["CustNo"] != null) {
        this.CustNo = params["CustNo"];
      }
    });
  }

  async ngOnInit() {
    await this.SetMainInfo();
    await this.SetAppAndAppOplList();
    
    this.isReady = true;
  }

  async SetMainInfo() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/view/app-list-view/view-application-list-customer-main-info.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
  }

  async SetAppAndAppOplList() {
    var requestCustNo = {
      TrxNo: this.CustNo
    };

    await this.http.post(URLConstant.GetAllAppAndAppOplListData, requestCustNo).toPromise().then(
      (response) => {
        if(response["AppListObjs"] !== null) {
          this.AppList = response["AppListObjs"];
        }

        if(response["AppOplListObjs"] !== null) {
          this.AppOplList = response["AppOplListObjs"];
        }
      }
    );
  }

  GetCallBack(event) {
    if(event.Key === "Customer") {
      AdInsHelper.OpenCustomerViewByCustId(this.CustId);
    }
  }

  OpenAppView(appId: number) {
    AdInsHelper.OpenAppViewByAppId(appId);
  }
}