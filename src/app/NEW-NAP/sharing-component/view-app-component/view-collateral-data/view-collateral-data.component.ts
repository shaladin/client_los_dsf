import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { formatDate } from '@angular/common';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { AppCollateralDocObj } from 'app/shared/model/AppCollateralDocObj.Model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-collateral-data',
  templateUrl: './view-collateral-data.component.html'
})
export class ViewCollateralDataComponent implements OnInit {

  @Input() appId: number = 0;
  CollateralType: string;
  CollateralName: string;
  CollateralPrice: number;
  ManufacturingYear: string;
  CollateralCondition: string;
  CollateralUsage: string;
  CollateralTaxDate: string;
  CollateralNotes: string;
  CollateralPrcnt: string;
  AppCollateralObj: AppCollateralObj = new AppCollateralObj();
  AppCollateralRegistration: AppCollateralRegistrationObj = new AppCollateralRegistrationObj();
  AppCollateralDocs: AppCollateralDocObj = new AppCollateralDocObj();
  AppCollateralId: number = 0;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.AppCollateralId = params["AppCollateralId"];
    });
  }

  ngOnInit() {

    this.getCollateralData();

  }
  getCollateralData() {
    var AppIdObj = {
      AppId: this.appId,
      AppCollateralId: this.AppCollateralId
    }
    this.http.post<AppCollateralObj>(AdInsConstant.GetAppCollateralAndRegistrationByAppCollateralId, AppIdObj).subscribe(
      (response) => {

        this.AppCollateralObj = response["AppCollateral"];
        this.AppCollateralRegistration = response["AppCollateralRegistration"];
        console.log("this.AppCollateralRegistration")
        console.log(this.AppCollateralRegistration)
        this.http.post<Array<AppCollateralDocObj>>(AdInsConstant.GetListAppCollateralDocsByAppCollateralId, this.AppCollateralObj).subscribe(
          (response) => {
            this.AppCollateralDocs = response["AppCollateralDocs"];
          }
        );
        if (this.AppCollateralObj.MrCollateralUsageCode == "COMM") {
          this.CollateralUsage = "Commercial";

        }
        else {
          this.CollateralUsage = "Non-Commercial";

        }

        this.CollateralTaxDate = formatDate(this.AppCollateralObj.AssetTaxDt, 'yyyy-MM-dd', 'en-US');
        this.CollateralType = this.AppCollateralObj.AssetTypeCode;
        this.CollateralNotes = this.AppCollateralObj.CollateralNotes;
        this.CollateralPrice = this.AppCollateralObj.CollateralValueAmt;
        this.CollateralName = this.AppCollateralObj.FullAssetName;
        this.ManufacturingYear = this.AppCollateralObj.ManufacturingYear;
        this.CollateralCondition = this.AppCollateralObj.MrCollateralConditionCode;


      });



  }
}
