import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ResAppCustForViewObj, ResCustDataPersonalForViewObj } from 'app/shared/model/Response/View/ResCustDataForViewObj.model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-app-cust-data-company-opl',
  templateUrl: './app-cust-data-company-opl.component.html',
  styleUrls: []
})
export class AppCustDataCompanyOplComponent implements OnInit {
  @Input() appId: number = 0;
  viewCustDataObj:  UcViewGenericObj = new UcViewGenericObj();
  appCustObj: ResAppCustForViewObj = new ResAppCustForViewObj();
  CustNoObj: GenericObj = new GenericObj();
  arrValue = [];
  isDataAlreadyLoaded: boolean = false;

  constructor(private http: HttpClient) { }

  async ngOnInit(): Promise<void> {
    await this.getCustData();
    this.arrValue.push(this.appCustObj.AppCustId);

    this.viewCustDataObj.viewInput = "./assets/ucviewgeneric/view/app-view/app-cust-data/company/view-app-cust-data-company-opl-cust-data.json";
    this.viewCustDataObj.viewEnvironment = environment.losUrl;
    this.viewCustDataObj.whereValue = this.arrValue;

    this.isDataAlreadyLoaded = true;
  }

  async getCustData() {
    var reqObj = { AppId: this.appId }
    await this.http.post(URLConstant.GetCustDataPersonalForViewByAppId, reqObj).toPromise().then(
      (response : ResCustDataPersonalForViewObj) => {
        this.appCustObj = response.AppCustObj;
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