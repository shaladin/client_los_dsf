import { Component, OnInit, Input } from '@angular/core';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-change-mou-main-info',
  templateUrl: './change-mou-main-info.component.html'
})
export class ChangeMouMainInfoComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() arrValue = [];

  AppObj: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewChangeMouMainInformation.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.whereValue = this.arrValue;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
      {
        name: "LeadNo",
        environment: environment.losR3Web
      },
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
  }

  GetCallBack(ev: any) {
    if (ev.Key == "CustView") {
      var custObj = { CustNo: ev.ViewObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }

}
