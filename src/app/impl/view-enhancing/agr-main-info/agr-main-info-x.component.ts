import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';

@Component({
  selector: 'app-agr-main-info-x',
  templateUrl: './agr-main-info-x.component.html'
})
export class AgrMainInfoXComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() arrValue = [];
  isReady: boolean = false;

  constructor(
    private router: Router, private http: HttpClient, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.viewGenericObj.whereValue = this.arrValue;
    await this.http.post(URLConstant.GetAgrmntByAgrmntId, { Id: this.arrValue[0] }).subscribe(
      async response => {
        let appId = response['AppId'];
        await this.http.post(URLConstant.GetAppById, { Id: appId }).subscribe(
          (response) => {
            if (response['BizTemplateCode'] == CommonConstant.FL4W) {
              this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrFL4WMainInfo.json";
            }
            else if (response['BizTemplateCode'] == CommonConstant.CFNA) {
              this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfoCfna.json";
            }
            else if (response['BizTemplateCode'] == CommonConstant.FCTR) {
              this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewAgrMainInfoFactoringX.json";
            }
            else {
              this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewAgrMainInfoX.json";
            }
            this.isReady = true;
          });
      }
    );
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
    else if (ev.Key == "Customer") {
      var custObj = {
        CustNo: ev.ViewObj.CustNo
      };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        (response) => {
          if(response['MrCustTypeCode'] == CommonConstant.CustTypePersonal) {
            AdInsHelper.OpenCustomerViewByCustId(response['CustId']);
          } else if(response['MrCustTypeCode'] == CommonConstant.CustTypeCompany) {
            AdInsHelper.OpenCustomerCoyViewByCustId(response['CustId']);
          }
        }
      )
    }
    else if (ev.Key == "AtpmName") {
      var custObj = {
        CustNo: ev.ViewObj.AtpmCustNo
      };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        (response) => {
          if(response['MrCustTypeCode'] == CommonConstant.CustTypePersonal) {
            AdInsHelper.OpenCustomerViewByCustId(response['CustId']);
          } else if(response['MrCustTypeCode'] == CommonConstant.CustTypeCompany) {
            AdInsHelper.OpenCustomerCoyViewByCustId(response['CustId']);
          }
        }
      )
    }
  }
}
