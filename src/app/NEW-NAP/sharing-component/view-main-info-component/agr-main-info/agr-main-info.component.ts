import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agr-main-info',
  templateUrl: './agr-main-info.component.html'
})
export class AgrMainInfoComponent implements OnInit {

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() arrValue = [];
  isViewReady: boolean = false;
 
  constructor(
    private router: Router, private http: HttpClient ) { }

  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfo.json";
    this.viewGenericObj.whereValue = this.arrValue;

    await this.http.post(URLConstant.GetAgrmntByAgrmntId, { Id: this.arrValue[0] }).toPromise().then(
      async response => {
        let appId = response['AppId'];
        await this.http.post(URLConstant.GetAppById, { Id: appId }).toPromise().then(
          (response) => {
            if(response['BizTemplateCode'] == CommonConstant.CFNA){
              this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfoCfna.json";
            }
            else{
              this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfo.json";
            }
            this.isViewReady = true;
          });
      }
    );
  }
  
  GetCallBack(ev: any){
    if(ev.Key == "ViewProdOffering"){ 
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);  
    }
    if(ev.Key == "Customer"){
      let custId: number;
      let mrCustTypeCode: string;
      let CustNoObj = { CustNo: ev.ViewObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, CustNoObj).subscribe(
        (response) => {
          custId = response['CustId'];
          mrCustTypeCode = response['MrCustTypeCode'];

          if (mrCustTypeCode == CommonConstant.CustTypeCompany) {
            AdInsHelper.OpenCustomerCoyViewByCustId(custId);
          }

          if (mrCustTypeCode == CommonConstant.CustTypePersonal) {
            AdInsHelper.OpenCustomerViewByCustId(custId);
          }
        });
    }
  }

}