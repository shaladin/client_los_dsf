import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-mou-main-info-core',
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
  @Input() MouCustId : number;
  whereValue = [];
  MouCustObj: MouCustObj = new MouCustObj();
  CustNoObj: GenericObj = new GenericObj();

  constructor(private http: HttpClient, private AdInsHelperService: AdInsHelperService) { }

  ngOnInit() {
    this.whereValue.push(this.MouCustId);
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouHeader.json";
    this.viewGenericObj.whereValue = this.whereValue;

    this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).subscribe(
      (response: MouCustObj) => {
        this.MouCustObj  = response;
      });
  }

  ReloadUcViewGeneric() {
    this.viewGeneric.initiateForm();
  }

  GetCallBack(ev) {
    if (ev.Key == "customer") {
      if (!ev.ViewObj.IsExistingCust) {
        AdInsHelper.OpenMOUCustViewByMouCustId(this.MouCustId);
      } else {
        this.CustNoObj.CustNo = ev.ViewObj.CustNo;
        this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
          response => {
            if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
              this.AdInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
            }
            if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
              this.AdInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
            }
          });
      }
    }
  }
}
