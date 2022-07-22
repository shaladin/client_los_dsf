import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-app-main-info-cr-x',
  templateUrl: './app-main-info-cr-x.component.html'
})
export class AppMainInfoCrXComponent implements OnInit {

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

  constructor(private http: HttpClient, private adInsHelperService: AdInsHelperService) { }

  ngOnInit() {
    if (this.BizTemplateCode == CommonConstant.CF4W) {
      // this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewNapAppMainInformationX.json";
      this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewNapAppMainInformationCrX.json";
    }
    else if (this.BizTemplateCode == CommonConstant.FL4W) {
      // this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewNapAppFL4WMainInformationX.json";
      this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewNapAppFL4WMainInformationCrX.json";
    }
    else if (this.BizTemplateCode == CommonConstant.CFNA) {
      // this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewAppMainInfoCFNAX.json";
      this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewAppMainInfoCFNACrX.json";
    }
    else if (this.BizTemplateCode == CommonConstant.OPL) {
      // this.viewGenericObj.viewInput = "./assets/ucviewgeneric/opl/view-opl-main-info.json";
      this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/opl/view-opl-main-info-x.json";
    }
    else {
      // this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewAppMainInfoX.json";
      this.viewGenericObj.viewInput =  "./assets/impl/ucviewgeneric/viewAppMainInfoCrX.json";
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
    }
    else if (ev.Key == "HighlightComment") {
      var custObj = { CustNo: ev.ViewObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          else if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
    else if (ev.Key == "Customer") {
      var custObj = {
        CustNo: ev.ViewObj.CustNo
      };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        (response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          else if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      )
    }
  }
}
