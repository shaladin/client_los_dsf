import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppInsObjObj } from 'app/shared/model/app-ins-obj-obj.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { AppInsuranceObj } from 'app/shared/model/app-insurance-obj.model';
import { AppInsMainCvgObj } from 'app/shared/model/app-ins-main-cvg-obj.model';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppViewInsuranceDetailComponent } from 'app/view-enhancing/app-view/app-insurance/app-insurance-detail/app-insurance-detail.component';

@Component({
  selector: "view-insurance",
  templateUrl: "./view-insurance.component.html"
})
export class ViewInsuranceComponent implements OnInit {
  @Input() AppId: number = 0;
  @Input() AppAssetId: number = 0;
  inputGridObj: InputGridObj;
  appInsuranceObj: AppInsuranceObj = new AppInsuranceObj();
  appInsObjObj: AppInsObjObj = new AppInsObjObj();
  appAssetObj: AppAssetObj = new AppAssetObj();
  appCollateralObj: AppCollateralObj = new AppCollateralObj();
  appInsMainCvgObjs: Array<AppInsMainCvgObj> = new Array<AppInsMainCvgObj>();
  
  appCollObjs: any;
  custTotalPremi: number;
  totalCapitalizedAmt: number;
  totalCustPaidAmt: number;

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppInsMainCvg.json";

    this.http.post(URLConstant.GetListAppInsObjByAppIdForView, { Id: this.AppId }).subscribe(
      (response: any) => {
        this.appCollObjs = response.CollateralAppInsObjects;
        this.custTotalPremi = response.AppInsurance.TotalCustPremiAmt;
        this.totalCapitalizedAmt = response.AppInsurance.TotalInsCptlzAmt;
        this.totalCustPaidAmt = response.AppInsurance.TotalPremiPaidByCustAmt;
      });
    
  }

  viewDetailCollateralHandler(appInsObjId){
    const modalInsDetail = this.modalService.open(AppViewInsuranceDetailComponent);
    modalInsDetail.componentInstance.AppInsObjId = appInsObjId;
    modalInsDetail.result.then().catch((error) => {
    });
  }
}
