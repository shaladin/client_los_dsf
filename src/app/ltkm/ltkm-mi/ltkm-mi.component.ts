import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model'; 

@Component({
  selector: 'app-ltkm-mi',
  templateUrl: './ltkm-mi.component.html'
})
export class LtkMainInfoComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() arrValue = []; //ltkmcustid

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewLtkmMainInfo.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.whereValue = this.arrValue;
  }

  GetCallBack(ev: any) {
      if (ev.Key == "ViewLtkm") {
        //   AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
      } else if (ev.Key == "ViewCust") {
        if(ev.ViewObj.CustId != 0)
        {
          if (ev.ViewObj.MrCustTypeCode == "PERSONAL") {
            AdInsHelper.OpenCustomerViewByCustId(ev.ViewObj.CustId);
          } else {
            AdInsHelper.OpenCustomerCoyViewByCustId(ev.ViewObj.CustId);
          }
      }
      } else if (ev.Key == "ViewApp") {
        if (ev.ViewObj.AppId != 0) {
          AdInsHelper.OpenAppViewByAppId(ev.ViewObj.AppId);
        }
      }
  }
}
