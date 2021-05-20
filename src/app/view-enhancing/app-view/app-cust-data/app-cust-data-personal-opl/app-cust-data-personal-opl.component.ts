import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ResAppCustForViewObj, ResCustDataPersonalForViewObj } from 'app/shared/model/Response/View/ResCustDataForViewObj.model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-app-cust-data-personal-opl',
  templateUrl: './app-cust-data-personal-opl.component.html',
  styleUrls: []
})
export class AppCustDataPersonalOplComponent implements OnInit {
  @Input() appId: number = 0;
  viewCustDataObj:  UcViewGenericObj = new UcViewGenericObj();
  viewSpouseDataObj:  UcViewGenericObj = new UcViewGenericObj();
  appCustObj: ResAppCustForViewObj = new ResAppCustForViewObj();
  appCustSpouseObj: ResAppCustForViewObj = new ResAppCustForViewObj();
  CustNoObj: GenericObj = new GenericObj();
  custArrValue = [];
  spouseArrValue = [];
  isDataAlreadyLoaded: boolean = false;
  isSpouseExists: boolean = false;

  constructor(private http: HttpClient) { }

  async ngOnInit(): Promise<void> {
    await this.getCustData();
    
    this.custArrValue.push(this.appCustObj.AppCustId);
    this.viewCustDataObj.viewInput = "./assets/ucviewgeneric/view/app-view/app-cust-data/personal/view-app-cust-data-personal-opl-cust-data.json";
    this.viewCustDataObj.viewEnvironment = environment.losUrl;
    this.viewCustDataObj.whereValue = this.custArrValue;

    if(this.isSpouseExists) {
      this.spouseArrValue.push(this.appCustSpouseObj.AppCustId);
      this.viewSpouseDataObj.viewInput = "./assets/ucviewgeneric/view/app-view/app-cust-data/personal/view-app-cust-data-personal-opl-spouse-data.json";
      this.viewSpouseDataObj.viewEnvironment = environment.losUrl;
      this.viewSpouseDataObj.whereValue = this.spouseArrValue;
    }

    this.isDataAlreadyLoaded = true;
  }

  async getCustData() {
    var reqObj = { AppId: this.appId }
    await this.http.post(URLConstant.GetCustDataPersonalForViewByAppId, reqObj).toPromise().then(
      (response : ResCustDataPersonalForViewObj) => {
        this.appCustObj = response.AppCustObj;
      }
    );

    await this.http.post(URLConstant.GetCustSpouseDataPersonalForViewByAppId, reqObj).toPromise().then(
      (response : ResCustDataPersonalForViewObj) => {
        if(response.AppCustObj !== null) {
          this.appCustSpouseObj = response.AppCustObj;
          this.isSpouseExists = true;
        }
      }
    );
  }

  GetCallBack(event) {
    if(event.Key === "Customer") {
      this.CustNoObj.CustNo = event.RowObj.custNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
      );
    }
  }
}