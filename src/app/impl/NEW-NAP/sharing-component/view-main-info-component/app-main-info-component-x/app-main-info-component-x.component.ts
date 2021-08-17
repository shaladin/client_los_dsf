import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

@Component({
  selector: 'app-app-main-info-component-x',
  templateUrl: './app-main-info-component-x.component.html'
})
export class AppMainInfoComponentXComponent implements OnInit {

  @Input() arrValue = [];

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AppObj: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.post(URLConstant.GetAppById, { id: this.arrValue[0] }).subscribe(
      (response) => {
        this.AppObj = response;
        if (this.AppObj.BizTemplateCode == CommonConstant.CF4W) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
        } else if (this.AppObj.BizTemplateCode == CommonConstant.FL4W) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppFL4WMainInformation.json";
        }
        //else if dibawah ini khusus X
        else if (this.AppObj.BizTemplateCode == CommonConstant.CFNA) {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAppMainInfoCFNA.json";
        } else {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAppMainInfo.json";
          console.log(this.AppObj.BizTemplateCode);
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

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    } else if (ev.Key == "HighligtComment") {
      var link: string;
      var custObj = { CustNo: ev.ViewObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
      );
    }
  }
}
