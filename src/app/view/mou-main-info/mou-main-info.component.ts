import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';


@Component({
  selector: 'app-mou-main-info',
  templateUrl: './mou-main-info.component.html',
  styleUrls: ['./mou-main-info.component.scss']
})
export class MouMainInfoComponent implements OnInit {
  private viewGeneric: UcviewgenericComponent;
  @ViewChild('viewGeneric') set content(content: UcviewgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.viewGeneric = content;
    }
  }
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  CustNoObj: GenericObj = new GenericObj();
  @Input() MouCustId : number;
  MouCustObj: MouCustObj = new MouCustObj();

  constructor(private http: HttpClient, private adInsHelperService: AdInsHelperService) { }

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
          response => {
            if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
              this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
            }
            if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
              this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
            }
          });
      }
    }
  }
}
