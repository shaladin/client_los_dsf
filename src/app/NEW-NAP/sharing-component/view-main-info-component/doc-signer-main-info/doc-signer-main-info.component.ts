import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

@Component({
  selector: 'app-doc-signer-main-info',
  templateUrl: './doc-signer-main-info.component.html'
})
export class DocSignerMainInfoComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() AppId: number;
  BizTemplateCode: string;

  constructor(
    private http: HttpClient) { }

  ngOnInit() {
    this.BizTemplateCode = localStorage.getItem("BizTemplateCode");
    this.http.post(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
      (response: AppObj) => {
        if (this.BizTemplateCode == CommonConstant.CFNA) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewDocSignerCfna.json";
        }
        else if(this.BizTemplateCode == CommonConstant.DF){
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewDocSignerDLFN.json";
        }
        else {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewDocSigner.json";
        }
      })
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
    if (ev.Key == "agrmnt") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.ViewObj.AgrmntId);
    }
  }
}
