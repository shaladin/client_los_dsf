import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppViewInsuranceDetailXComponent } from './app-insurance-detail/app-insurance-detail-x.component';
import { ViewAssetDataDetailXComponent } from '../view-asset-data/view-asset-data-detail/view-asset-data-detail-x.component';

@Component({
  selector: 'app-app-insurance-x',
  templateUrl: './app-insurance-x.component.html',
  styles: []
})
export class AppInsuranceXComponent implements OnInit {
  @Input() AppId: number;
  @Input() BizTemplateCode : string = "";
  appInsObjs: any;
  appCollObjs: any;
  custTotalPremi: number;
  totalCapitalizedAmt: number;
  totalCustPaidAmt: number;
  isFCTR : boolean = false;
  isReadyCvg: boolean = false;

  appInsCvgs: Array<any>;
  appInsCvgsFinal: Array<any> = new Array<any>();

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal
  ) {
    this.custTotalPremi = 0;
    this.totalCapitalizedAmt = 0;
    this.totalCustPaidAmt = 0;
  }

  async ngOnInit() {
    if(this.BizTemplateCode == CommonConstant.FCTR || this.BizTemplateCode == CommonConstant.CF4W /* penjagaan CF4W Fleet - Perubahan Impl X*/){
      this.isFCTR = true;
    }
    await this.httpClient.post(URLConstant.GetListAppInsObjByAppIdForView, { Id: this.AppId }).toPromise().then(
      (response: any) => {
        this.appInsObjs = response.LoanAppInsObjects;
        this.appCollObjs = response.CollateralAppInsObjects;
        this.custTotalPremi = response.AppInsurance.TotalCustPremiAmt;
        this.totalCapitalizedAmt = response.AppInsurance.TotalInsCptlzAmt;
        this.totalCustPaidAmt = response.AppInsurance.TotalPremiPaidByCustAmt;
        this.GetAppInsCvg(this.appCollObjs[0].AppInsObjId);
        this.isReadyCvg = true;
      });


  }

  viewDetailLoanHandler(appAssetId){
    const modalAssetDetail = this.modalService.open(ViewAssetDataDetailXComponent);
    modalAssetDetail.componentInstance.AppAssetId = appAssetId;
    modalAssetDetail.componentInstance.AppId = this.AppId;
    modalAssetDetail.result.then().catch((error) => {
    });
  }

  viewDetailCollateralHandler(appInsObjId){
    const modalInsDetail = this.modalService.open(AppViewInsuranceDetailXComponent);
    modalInsDetail.componentInstance.AppInsObjId = appInsObjId;
    modalInsDetail.result.then().catch((error) => {
    });
  }

  async GetAppInsCvg(appInsObjId){
    await this.httpClient.post(URLConstant.GetAppInsObjViewDetail, { Id: appInsObjId }).toPromise().then(
      (response: any) => {
        this.appInsCvgs = response.appInsCvgs;
      });

      for (const item of this.appInsCvgs) {
        var addCvg = "";
        for (let i = 0; i < item.appInsAddCvgObjs.length; i++){
          if (i == (item.appInsAddCvgObjs.length - 1)) {
            addCvg += item.appInsAddCvgObjs[i].MrAddCvgTypeCode;
          }
          else {
            addCvg += item.appInsAddCvgObjs[i].MrAddCvgTypeCode + ", ";
          }
        }

        this.appInsCvgsFinal.push({
          YearNo: item.appInsMainCvgObj.YearNo,
          MrMainCvgTypeCode: item.appInsMainCvgObj.MrMainCvgTypeCode,
          MrAddCvgTypeCode: addCvg
        });

      }
  }
}
