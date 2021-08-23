import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-crd-rvw-cust-hist-data-x',
  templateUrl: './crd-rvw-cust-hist-data-x.component.html',
  providers: [NGXToastrService]
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

  ReturnAgrmnt: any;

  constructor(private http: HttpClient, private toastr: NGXToastrService) { }

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

  ClickLinkAppNo(AppId) {
    AdInsHelper.OpenAppViewByAppId(AppId);
  }

  ClickLinkAgrmntNo(AgrmntNo) {
    this.http.post(URLConstant.GetAgrmntByAgrmntNo, { TrxNo: AgrmntNo }).subscribe(
      (response) => {
        this.ReturnAgrmnt = response;
        if(this.ReturnAgrmnt.AgrmntId != 0 && this.ReturnAgrmnt.AgrmntId != null && this.ReturnAgrmnt.AgrmntId != undefined) {
          AdInsHelper.OpenAgrmntViewByAgrmntId(this.ReturnAgrmnt.AgrmntId);
        } else {
          this.toastr.errorMessage("Data not found");
        }
      }
    );
  }
}



