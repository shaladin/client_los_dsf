import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-mou-main-info',
  templateUrl: './mou-main-info.component.html'
})
export class MouMainInfoComponent implements OnInit {
  private viewGeneric: UcviewgenericComponent;
  @ViewChild('viewGeneric') set content(content: UcviewgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.viewGeneric = content;
    }
  }
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() MouCustId: number;
  MouCustObj: MouCustObj = new MouCustObj();
  CustNoObj: GenericObj = new GenericObj();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouHeader.json";

    this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).subscribe(
      (response: MouCustObj) => {
        this.MouCustObj  = response;
      });
  }

  ReloadUcViewGeneric() {
    this.viewGeneric.initiateForm();
  }

  GetCallBack(ev: any) {
    if (ev.Key == "customer") {
      if (!this.MouCustObj.IsExistingCust) {
        AdInsHelper.OpenMOUCustViewByMouCustId(this.MouCustId);
      } else {
        this.CustNoObj.CustNo = this.MouCustObj.CustNo;
        this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
          responseCust => {
            if(responseCust["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
              AdInsHelper.OpenCustomerViewByCustId(responseCust["CustId"]);
            }
            if(responseCust["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
              AdInsHelper.OpenCustomerCoyViewByCustId(responseCust["CustId"]);
            }
          });
      }
    }
  }
}
