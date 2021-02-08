import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model'; 
import { UcviewgenericComponent } from '@adins/ucviewgeneric';

@Component({
  selector: 'app-app-main-info',
  templateUrl: './app-main-info.component.html',
  styleUrls: ['./app-main-info.component.scss']
})
export class AppMainInfoComponent implements OnInit {

  private viewGeneric : UcviewgenericComponent;
  @ViewChild('viewGeneric') set content(content: UcviewgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.viewGeneric = content;
    }
  }
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() arrValue = [];
  
  AppObj: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.post(URLConstant.GetAppById, { AppId: this.arrValue[0] }).subscribe(
      (response) => {
        this.AppObj = response;
        if (this.AppObj.BizTemplateCode == CommonConstant.CF4W) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
        } else if (this.AppObj.BizTemplateCode == CommonConstant.FL4W) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppFL4WMainInformation.json";
        } else {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAppMainInfo.json";
        }
        this.viewGenericObj.viewEnvironment = environment.losUrl;
        this.viewGenericObj.whereValue = this.arrValue;
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
