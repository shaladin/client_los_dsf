import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';

@Component({
  selector: 'app-cust-app-list-view',
  templateUrl: './cust-app-list-view.component.html',
  styleUrls: []
})
export class CustAppListViewComponent implements OnInit {

  CustNo: string = '';
  CustId: number = 0;
  isReady: boolean = false;
  isOplReady: boolean = false;
  isOpl: boolean = false;
  CustAppList: Array<any> = new Array<any>();
  AppList: Array<any> = new Array<any>();
  AppOplList: Array<any> = new Array<any>();

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["CustNo"] != null) {
        this.CustNo = params["CustNo"];
      }
      if (params["CustId"] != null) {
        this.CustId = params["CustId"];
      }
    });
  }

  async ngOnInit() {
    await this.SetAppList();
    await this.checkIsOpl();
    if(this.isOpl){
      await this.SetAppAndAppOplList();
    }
    this.isReady = true;
  }

  async SetAppList() {
    await this.http.post(URLConstant.GetAppListForCustView, {CustNo: this.CustNo}).toPromise().then(
      (response) => {
        if(response[CommonConstant.ReturnObj] != null) {
          this.CustAppList = response[CommonConstant.ReturnObj];
        }
      }
    );
  }

  async SetAppAndAppOplList() {
    var requestCustNo = {
      TrxNo: this.CustNo
    };

    await this.http.post(URLConstant.GetAllAppAndAppOplListData, requestCustNo).toPromise().then(
      (response) => {
        if(response === undefined){
          return;
        }

        if(response["AppListObjs"] !== null) {
          this.AppList = response["AppListObjs"];
        }

        if(response["AppOplListObjs"] !== null) {
          this.AppOplList = response["AppOplListObjs"];
        }

        this.isOplReady = true;
      }
    );
  }

  appNoHandler(event) {
    AdInsHelper.OpenAppViewByAppId(event.AppId);
  }

  async checkIsOpl() {
    let reqGetSysConfigResultLOSObj = new GenericObj();
    reqGetSysConfigResultLOSObj.Code  = CommonConstant.MODULE_LMS;
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigResultByCode, {ConfigCode : reqGetSysConfigResultLOSObj.Code}).toPromise().then(
      (response) => {
        if(response.ConfigValue === "1") {
          this.isOpl = true;
        }
      }
    );
  }

}
