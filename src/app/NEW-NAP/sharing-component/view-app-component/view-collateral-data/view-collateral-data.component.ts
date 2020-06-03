import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { formatDate } from '@angular/common';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { AppCollateralDocObj } from 'app/shared/model/AppCollateralDocObj.Model';

@Component({
  selector: 'app-view-collateral-data',
  templateUrl: './view-collateral-data.component.html',
  styleUrls: ['./view-collateral-data.component.scss']
})
export class ViewCollateralDataComponent implements OnInit {

  @Input() appId: number;
  CollateralType: string;
  CollateralName: string;
  CollateralPrice: string;
  ManufacturingYear: string;
  CollateralCondition: string;
  CollateralUsage: string;
  CollateralTaxDate: string;
  CollateralNotes: string;
  CollateralPrcnt: string;
  AppCollateralObj: AppCollateralObj = new AppCollateralObj();
  AppCollateralRegistration: AppCollateralRegistrationObj = new AppCollateralRegistrationObj();
  AppCollateralDocs: AppCollateralDocObj = new AppCollateralDocObj();
  
  constructor(private http: HttpClient) { }

  ngOnInit(){

     this.getCollateralData();

  }
  getCollateralData() {
    var AppIdObj = {
      AppId: this.appId
    }
    this.http.post<AppCollateralObj>(AdInsConstant.GetAppCollateralByAppId, AppIdObj).subscribe(
      (response) => {
        
        this.AppCollateralObj = response;
        this.http.post<AppCollateralRegistrationObj>(AdInsConstant.GetAppCollateralRegistrationByAppCollateralId, this.AppCollateralObj).subscribe(
          (response) => {
            this.AppCollateralRegistration = response;
            console.log(this.AppCollateralRegistration)
          });
    
        this.http.post<Array<AppCollateralDocObj>>(AdInsConstant.GetListAppCollateralDocsByAppCollateralId, this.AppCollateralObj).subscribe(
          (response) => {
            this.AppCollateralDocs = response["AppCollateralDocs"];
            console.log("response");
            console.log(response);
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
