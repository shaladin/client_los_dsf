import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';

@Component({
  selector: 'app-crd-rvw-cust-hist-data-x',
  templateUrl: './crd-rvw-cust-hist-data-x.component.html'
})
export class CrdRvwCustHistDataXComponent implements OnInit {
  @Input() AppId: number = 0;

  BizTemplateCode: string = "";
  IsViewReady: boolean = false;

  CustNo: any;
  ExstAgrmnt: any;
  AppRjct: any;
  AppPrcs: any;

  TotalNTF: number = 0;
  TotalUnit: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.IsViewReady = true;

    this.http.post(URLConstant.GetCustDataByAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.CustNo = response['AppCustObj']['CustNo'];

        if(this.CustNo != null && this.CustNo != undefined && this.CustNo != "") {
          let reqObjListCustNo = {
            ListCustNo: [this.CustNo]
          }
          this.http.post(URLConstantX.GetAgrmntHistByListCustNo, reqObjListCustNo).subscribe(
            (response) => {
              this.ExstAgrmnt = response;
              this.GetTotalNTFAndUnit();
            }
          );

          this.http.post(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
            (response: AppObj) => {
              let reqObj = {
                CustNo: this.CustNo, 
                IsAppInitDone: response.IsAppInitDone
              }
              this.http.post(URLConstantX.GetAppByCustNoAndIsAppInitDone, reqObj).subscribe(
                (response) => {
                  this.AppPrcs = response;
                }
              );
            }
          );

          let reqObj = {
            CustNo: this.CustNo,
            AppStat:"RJC"
          }
          this.http.post(URLConstantX.GetAppByCustNoAndAppStat, reqObj).subscribe(
            (response) => {
              this.AppRjct = response;
            }
          );
        }
      }
    );
  }

  GetTotalNTFAndUnit() {
    if(this.ExstAgrmnt != undefined && this.ExstAgrmnt.length != 0) {
      var existingAgreement = this.ExstAgrmnt;
      existingAgreement.forEach(element => {
        this.TotalNTF = this.TotalNTF + element.NTFAmount;
        this.TotalUnit = this.TotalUnit + element.NumOfAsset;
      });
    }
  }
}



