import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private http: HttpClient, private translateService: TranslateService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if(params["AppId"] == "undefined"){
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
    }
  }
}