import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';

@Component({
  selector: 'app-app-main-info',
  templateUrl: './app-main-info.component.html'
})
export class AppMainInfoComponent implements OnInit {
  private viewGeneric : UcviewgenericComponent;
  whereValue = [];
  @ViewChild('viewGeneric') set content(content: UcviewgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.viewGeneric = content;
    }
  }
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() AppId: number;
  AppObj: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.post(URLConstant.GetAppById, { AppId: this.AppId }).subscribe(
      (response) => {
        this.AppObj = response;
        if (this.AppObj.BizTemplateCode == CommonConstant.CF4W) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
        }
        else if (this.AppObj.BizTemplateCode == CommonConstant.FL4W) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppFL4WMainInformation.json";
        }
        else if (this.AppObj.BizTemplateCode == CommonConstant.OPL) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppOPLMainInformation.json";
        }
        else {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAppMainInfo.json";
        }
        this.viewGenericObj.viewEnvironment = environment.losUrl;
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
    );
  }

  ReloadUcViewGeneric(){
    this.viewGeneric.initiateForm();
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }
}