import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-app-main-info',
  templateUrl: './app-main-info.component.html'
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
  @Input() AppId: number;
  AppNo: number;
  AppObj: any;

  constructor(
    private http: HttpClient, 
    private translateService: TranslateService, 
    private route: ActivatedRoute,
    private adInsHelperService: AdInsHelperService) {
    this.route.queryParams.subscribe(params => {
      if(params["AppId"] === undefined){
        this.AppNo = params["AppNo"]

      }else{
        this.AppId = params["AppId"];

      }
    })
   }

  ngOnInit() {
    this.translateService.use(localStorage.getItem('lang') || 'en');
    this.http.post(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
      (response) => {
        this.AppObj = response;
        if (this.AppObj.BizTemplateCode == CommonConstant.CF4W) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
        }
        else if (this.AppObj.BizTemplateCode == CommonConstant.FL4W) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppFL4WMainInformation.json";
        }
        else if (this.AppObj.BizTemplateCode == CommonConstant.CFNA) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAppMainInfoCFNA.json";
        }
        else if (this.AppObj.BizTemplateCode == CommonConstant.OPL) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/opl/view-opl-main-info.json";
        }
        else if (this.AppNo != null){
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAppMainInfoByAppNo.json";
        }else{
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAppMainInfo.json";
        }
      }
    );
  }

  ReloadUcViewGeneric() {
    this.viewGeneric.initiateForm();
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    } else if (ev.Key == "HighlightComment") {
      var link: string;
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
}
