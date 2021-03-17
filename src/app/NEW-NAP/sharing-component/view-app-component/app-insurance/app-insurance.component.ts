import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAssetDataDetailComponent } from '../app-asset-data/app-asset-data-detail/app-asset-data-detail.component';
import { AppInsuranceDetailComponent } from './app-insurance-detail/app-insurance-detail.component';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-app-insurance',
  templateUrl: './app-insurance.component.html',
  styles: []
})
export class AppInsuranceComponent implements OnInit {
  @Input() AppId: number;
  @Input() BizTemplateCode : string = "";
  appInsObjs: any;
  appCollObjs: any;
  custTotalPremi: number;
  totalCapitalizedAmt: number;
  totalCustPaidAmt: number;
  isFCTR : boolean = false;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal
  ) { 
    this.custTotalPremi = 0;
    this.totalCapitalizedAmt = 0;
    this.totalCustPaidAmt = 0;
  }

  ngOnInit() {
    if(this.BizTemplateCode == CommonConstant.FCTR){
      this.isFCTR = true;
    }
    this.httpClient.post(URLConstant.GetListAppInsObjByAppIdForView, { Id: this.AppId }).subscribe(
      (response: any) => {
        this.appInsObjs = response.LoanAppInsObjects;
        this.appCollObjs = response.CollateralAppInsObjects;
        this.custTotalPremi = response.AppInsurance.TotalCustPremiAmt;
        this.totalCapitalizedAmt = response.AppInsurance.TotalInsCptlzAmt;
        this.totalCustPaidAmt = response.AppInsurance.TotalPremiPaidByCustAmt;
      });
  }

  viewDetailLoanHandler(appAssetId){
    const modalAssetDetail = this.modalService.open(AppAssetDataDetailComponent);
    modalAssetDetail.componentInstance.AppAssetId = appAssetId;
    modalAssetDetail.componentInstance.AppId = this.AppId;
    modalAssetDetail.result.then().catch((error) => {
    });
  }

  viewDetailCollateralHandler(appInsObjId){
    const modalInsDetail = this.modalService.open(AppInsuranceDetailComponent);
    modalInsDetail.componentInstance.AppInsObjId = appInsObjId;
    modalInsDetail.result.then().catch((error) => {
    });
  }
}
