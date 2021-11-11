import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';

@Component({
  selector: 'app-app-main-info-x',
  templateUrl: './app-main-info-x.component.html'
})
export class AppMainInfoXComponent implements OnInit {

  private viewGeneric: UcviewgenericComponent;
  whereValue = [];
  @ViewChild('viewGeneric') set content(content: UcviewgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.viewGeneric = content;
    }
  }
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() AppId: number;
  @Input() BizTemplateCode: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    if (this.BizTemplateCode == CommonConstant.CF4W) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    }
    else if (this.BizTemplateCode == CommonConstant.FL4W) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppFL4WMainInformation.json";
    }
    else if (this.BizTemplateCode == CommonConstant.CFNA) {
      this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewAppMainInfoCFNAX.json";
    }
    else if (this.BizTemplateCode == CommonConstant.OPL) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/opl/view-opl-main-info.json";
    }
    else {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAppMainInfo.json";
    }
    this.whereValue.push(this.AppId);
    this.viewGenericObj.whereValue = this.whereValue;
  }

  ReloadUcViewGeneric() {
    this.viewGeneric.initiateForm();
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    } else if (ev.Key == "HighlightComment") {
      var custObj = { CustNo: ev.ViewObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
      );
    }
  }
}
