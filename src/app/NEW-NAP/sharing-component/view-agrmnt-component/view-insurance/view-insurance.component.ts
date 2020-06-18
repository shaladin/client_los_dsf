import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAssetDataDetailComponent } from '../../view-app-component/app-asset-data/app-asset-data-detail/app-asset-data-detail.component';

@Component({
  selector: 'agrmnt-view-insurance',
  templateUrl: './view-insurance.component.html'
})
export class ViewInsuranceComponent implements OnInit {
  @Input() agrmntId: number = 0;
  AppId: number = 0;
  appInsObjs: any;
  appCollObjs: any;
  custTotalPremi: number;
  totalCapitalizedAmt: number;
  totalCustPaidAmt: number;
  ResponseAppDetailData: any;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal
  ) {
    this.custTotalPremi = 0;
    this.totalCapitalizedAmt = 0;
    this.totalCustPaidAmt = 0;
  }

  ngOnInit() {
    this.GetAppAndAppCustDetailByAgrmntId();
    this.httpClient.post(AdInsConstant.GetListAppInsObjByAgrmntIdForView, { AgrmntId: this.agrmntId }).subscribe(
      (response: any) => {
        this.appInsObjs = response.LoanAppInsObjects;
        this.appCollObjs = response.CollateralAppInsObjects;
        this.custTotalPremi = response.AppInsurance.TotalCustPremiAmt;
        this.totalCapitalizedAmt = response.AppInsurance.TotalInsCptlzAmt;
        this.totalCustPaidAmt = response.AppInsurance.TotalPremiPaidByCustAmt;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetAppAndAppCustDetailByAgrmntId() {
    var obj = { agrmntId: this.agrmntId };
    this.httpClient.post(AdInsConstant.GetAppAndAppCustDetailByAgrmntId, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.ResponseAppDetailData = response;
        this.AppId = this.ResponseAppDetailData.AppId;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  viewDetailLoanHandler(appAssetId) {
    const modalAssetDetail = this.modalService.open(AppAssetDataDetailComponent);
    modalAssetDetail.componentInstance.AppAssetId = appAssetId;
    modalAssetDetail.componentInstance.AppId = this.AppId;
    modalAssetDetail.result.then().catch((error) => {
      if (error != 0) {
        console.log(error);
      }
    });
  }
}
