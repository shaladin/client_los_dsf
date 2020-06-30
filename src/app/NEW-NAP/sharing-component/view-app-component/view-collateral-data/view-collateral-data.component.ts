import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { formatDate } from '@angular/common';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { AppCollateralDocObj } from 'app/shared/model/AppCollateralDocObj.Model';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-collateral-data',
  templateUrl: './view-collateral-data.component.html'
})
export class ViewCollateralDataComponent implements OnInit {
  viewObj: string;
  viewUOLObj: string;
  viewEnvironment: string;
  AppId: number;
  @Input() appId: number = 0;
  AppCollateralObj: AppCollateralObj = new AppCollateralObj();
  AppCollateralDocs: AppCollateralDocObj = new AppCollateralDocObj();
  AppCollateralId: number = 0;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.AppCollateralId = params["AppCollateralId"];
    });
  }

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewCollateralData.json";
    this.viewUOLObj = "./assets/ucviewgeneric/viewCollateralDataUserOwnerLocation.json";
    this.viewEnvironment = environment.losUrl;
    this.getCollateralData();

  }
  getCollateralData() {
    var AppIdObj = {
      AppId: this.AppId,
      AppCollateralId: this.AppCollateralId
    }
    this.http.post<AppCollateralObj>(AdInsConstant.GetAppCollateralAndRegistrationByAppCollateralId, AppIdObj).subscribe(
      (response) => {
        this.AppCollateralObj = response["AppCollateral"];

        this.http.post<Array<AppCollateralDocObj>>(AdInsConstant.GetListAppCollateralDocsByAppCollateralId, this.AppCollateralObj).subscribe(
          (response) => {
            this.AppCollateralDocs = response["AppCollateralDocs"];
          }
        );
      });
  }
}
