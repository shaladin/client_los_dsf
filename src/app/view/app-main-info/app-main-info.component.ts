import { Component, OnInit, Input } from '@angular/core';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-app-main-info',
  templateUrl: './app-main-info.component.html'
})
export class AppMainInfoComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() AppId: number;
  AppObj: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.post(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
      (response) => {
        this.AppObj = response;
        if (this.AppObj.BizTemplateCode == CommonConstant.CF4W) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
        } else if (this.AppObj.BizTemplateCode == CommonConstant.FL4W) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppFL4WMainInformation.json";
        } else {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAppMainInfo.json";
        }
        this.viewGenericObj.whereValue = [
          {
            property: "AppId",
            value: this.AppId
          }
        ];
      }
    );
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

}
