import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppInsObjObj } from 'app/shared/model/app-ins-obj-obj.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { AppInsuranceObj } from 'app/shared/model/app-insurance-obj.model';
import { AppInsMainCvgObj } from 'app/shared/model/app-ins-main-cvg-obj.model';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';

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

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppInsMainCvg.json";
    this.getInsuranceData();
  }

  getInsuranceData() {
    if (this.AppId != 0 && this.AppId != null && this.AppId != undefined) {
      var reqObj = { Id: this.AppId };
      this.http.post(URLConstant.GetInsuranceDataByAppIdForView, reqObj).subscribe(
        (response) => {
          this.appInsuranceObj = response["AppInsuranceObj"];
          this.appInsObjObj = response["AppInsObjObj"];
          if (response["AppAssetObj"] != null) {
            this.appAssetObj = response["AppAssetObj"];
          }
          if (response["AppCollateralObj"] != null) {
            this.appCollateralObj = response["AppCollateralObj"];
          }
          this.appInsMainCvgObjs = response["AppInsMainCvgObjs"];

          var detailForGridCoverage = {
            Data: this.appInsMainCvgObjs,
            Count: "0"
          }

          this.inputGridObj.resultData = detailForGridCoverage;
        });
    }
    else {
      var reqAssetObj = { Id: this.AppAssetId };
      this.http.post(URLConstant.GetInsuranceDataByAppAssetIdForView, reqAssetObj).subscribe(
        (response) => {
          this.appInsuranceObj = response["AppInsuranceObj"];
          this.appInsObjObj = response["AppInsObjObj"];
          if (response["AppAssetObj"] != null) {
            this.appAssetObj = response["AppAssetObj"];
          }
          if (response["AppCollateralObj"] != null) {
            this.appCollateralObj = response["AppCollateralObj"];
          }
          this.appInsMainCvgObjs = response["AppInsMainCvgObjs"];

          var detailForGridCoverage = {
            Data: this.appInsMainCvgObjs,
            Count: "0"
          }

          this.inputGridObj.resultData = detailForGridCoverage;
        });
    }
  }
}
