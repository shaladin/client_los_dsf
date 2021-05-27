import { Component, OnInit, Input } from '@angular/core';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-agr-main-info',
  templateUrl: './agr-main-info.component.html'
})
export class AgrMainInfoComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() arrValue = [];
  isReady: boolean = false;
 
  constructor(
    private router: Router, private http: HttpClient, private route: ActivatedRoute ) { }

  async ngOnInit() {
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

    await this.http.post(URLConstant.GetAgrmntByAgrmntId, { Id: this.arrValue[0] }).subscribe(
      async response => {
        let appId = response['AppId'];
        await this.http.post(URLConstant.GetAppById, { Id: appId }).subscribe(
          (response) => {
            if(response['BizTemplateCode'] == CommonConstant.FL4W){
              this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrFL4WMainInfo.json";
            }
            else if(response['BizTemplateCode'] == CommonConstant.CFNA) {
		      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfoCFNA.json";
		    } 
            else{
              this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfo.json";
            }
            this.isReady = true;
          });
      }
    );
  }
  
  GetCallBack(ev: any){
    if(ev.Key == "ViewProdOffering"){ 
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);  
    }
  }
}
