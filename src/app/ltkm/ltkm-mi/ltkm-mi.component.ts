import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model'; 
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
@Component({
  selector: 'app-ltkm-mi',
  templateUrl: './ltkm-mi.component.html'
})
export class LtkMainInfoComponent implements OnInit {
  private viewGeneric: UcviewgenericComponent;
  @ViewChild('viewGeneric') set content(content: UcviewgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.viewGeneric = content;
    }
  }
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() arrValue = []; //ltkmcustid

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewLtkmMainInfo.json";
  }

  ReloadUcViewGeneric() {
    this.viewGeneric.initiateForm();
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
