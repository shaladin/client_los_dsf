import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { NegCustIndicatorObj } from 'app/shared/model/app-cust/neg-cust/neg-cust-indicator-obj.model';

@Component({
  selector: 'app-app-main-info',
  templateUrl: './app-main-info.component.html',
  styleUrls: ['./app-main-info.component.scss']
})
export class AppMainInfoComponent implements OnInit {

  private viewGeneric: UcviewgenericComponent;
  whereValue = [];
  @ViewChild('viewGeneric') set content(content: UcviewgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.viewGeneric = content;
    }
  }
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  isNegCustIndicatorVisible: boolean = false;
  isCustTypeCoy: boolean = false;
  negCustIndicator: NegCustIndicatorObj = new NegCustIndicatorObj();

  
  @Input() AppId: number;
  @Input() BizTemplateCode: string;

  constructor(private http: HttpClient, private adInsHelperService: AdInsHelperService) { }

  ngOnInit() {
    if (this.BizTemplateCode == CommonConstant.CF4W) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    }
    else if (this.BizTemplateCode == CommonConstant.FL4W) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppFL4WMainInformation.json";
    }
    else if (this.BizTemplateCode == CommonConstant.CFNA) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAppMainInfoCFNA.json";
    }
    else if (this.BizTemplateCode == CommonConstant.OPL) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/opl/view-opl-main-info.json";
    }
    else {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAppMainInfo.json";
    }
    this.whereValue.push(this.AppId);
    this.viewGenericObj.whereValue = this.whereValue;
    this.getNegativeCustIndicator();
  }

  ReloadUcViewGeneric() {
    this.viewGeneric.initiateForm();
    this.getNegativeCustIndicator();
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    } else if (ev.Key == "HighlightComment") {
      var custObj = { CustNo: ev.ViewObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }

  getNegativeCustIndicator(){
    this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GsCodeNegCustAllowNap }).subscribe(
      (resGs) => {
        if(resGs.GsValue == null || resGs.GsValue == undefined ) return;

        this.isNegCustIndicatorVisible = true;
        this.http.post<NegCustIndicatorObj>(URLConstant.GetNegCustIndicatorByAppId, { Id: this.AppId }).subscribe(
          (res) => {
            this.negCustIndicator = res;
            this.isCustTypeCoy = this.negCustIndicator.Customer && this.negCustIndicator.Customer.MrCustTypeCode == CommonConstant.CustTypeCompany;
          }
        );
      }
    );
  }
}
