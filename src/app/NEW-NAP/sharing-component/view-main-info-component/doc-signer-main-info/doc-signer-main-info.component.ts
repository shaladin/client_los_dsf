import { Component, Input, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-doc-signer-main-info',
  templateUrl: './doc-signer-main-info.component.html'
})
export class DocSignerMainInfoComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() arrValue = [];

  constructor() { }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewDocSigner.json";
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
    ];
  }
  
  GetCallBack(ev: any){
    if(ev.Key == "ViewProdOffering"){
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);  
    }
    if(ev.Key == "agrmnt")
    {
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.ViewObj.AgrmntId);
    }
  }
}
