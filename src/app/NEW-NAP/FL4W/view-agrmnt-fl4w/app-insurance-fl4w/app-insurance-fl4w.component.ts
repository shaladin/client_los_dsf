import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAssetDataDetailComponent } from 'app/NEW-NAP/sharing-component/view-app-component/app-asset-data/app-asset-data-detail/app-asset-data-detail.component';
import { AppInsuranceDetailComponent } from 'app/NEW-NAP/sharing-component/view-app-component/app-insurance/app-insurance-detail/app-insurance-detail.component';
import { AppAssetDataDetailFl4wComponent } from '../app-asset-data-fl4w/app-asset-data-detail-fl4w/app-asset-data-detail-fl4w.component';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppInsObjObj } from 'app/shared/model/AppInsObjObj.Model';
import { AppAssetCollateralForInsuranceObj } from 'app/shared/model/AppAssetCollateralForInsurance.Model';

@Component({
  selector: 'app-app-insurance-fl4w',
  templateUrl: './app-insurance-fl4w.component.html'
})
export class AppInsuranceFl4wComponent implements OnInit {
  @Input() AgrmntId: number;
  appInsObjs: Array<AppAssetCollateralForInsuranceObj>;
  appCollObjs: AppInsObjObj;
  custTotalPremi: number;
  totalCapitalizedAmt: number;
  totalCustPaidAmt: number;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal
  ) { 
    this.custTotalPremi = 0;
    this.totalCapitalizedAmt = 0;
    this.totalCustPaidAmt = 0;
  }

  ngOnInit() {
    this.httpClient.post(URLConstant.GetListAppInsObjByAgrmntIdForView, { Id: this.AgrmntId }).subscribe(
      (response: any) => {
        this.appInsObjs = response.LoanAppInsObjects;
        this.appCollObjs = response.CollateralAppInsObjects;
        this.custTotalPremi = response.AppInsurance.TotalCustPremiAmt;
        this.totalCapitalizedAmt = response.AppInsurance.TotalInsCptlzAmt;
        this.totalCustPaidAmt = response.AppInsurance.TotalPremiPaidByCustAmt;
      });
  }

  viewDetailCollateralHandler(appInsObjId){
    const modalInsDetail = this.modalService.open(AppInsuranceDetailComponent);
    modalInsDetail.componentInstance.AppInsObjId = appInsObjId;
    modalInsDetail.result.then().catch((error) => {
    });
  }
}

