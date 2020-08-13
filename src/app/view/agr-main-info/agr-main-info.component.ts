import { Component, OnInit, Input } from '@angular/core';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-agr-main-info',
  templateUrl: './agr-main-info.component.html'
})
export class AgrMainInfoComponent implements OnInit {


  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() arrValue = [];
 
  constructor(
    private router: Router ) { }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfo.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.whereValue = this.arrValue;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
      {
        name: "AgrmntNo",
        environment: environment.losR3Web
      },
    ];
  }
  
  GetCallBack(ev: any){
    if(ev.Key == "ViewProdOffering"){ 
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);  
    }
  }
}
