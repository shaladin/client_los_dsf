import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
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
  whereValue = [];
  @ViewChild('viewGeneric') set content(content: UcviewgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.viewGeneric = content;
    }
  }
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() AppId: number ;
  @Input() BizTemplateCode: string ;

  AppObj: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    if (this.BizTemplateCode == CommonConstant.CF4W) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    }
    else if (this.BizTemplateCode == CommonConstant.FL4W) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppFL4WMainInformation.json";
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
  
  ReloadUcViewGeneric(){
    this.viewGeneric.initiateForm();
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }
}
