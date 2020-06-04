import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-collateral-multi-asset',
  templateUrl: './view-collateral-multi-asset.component.html',
  styleUrls: ['./view-collateral-multi-asset.component.scss']
})
export class ViewCollateralMultiAssetComponent implements OnInit {

  @Input() appId: number;
  AppCollateralObj: AppCollateralObj = new AppCollateralObj();

  constructor(private http: HttpClient, private router : Router) { }

  ngOnInit() {
    var AppIdObj = {
      AppId: this.appId
    }
    this.http.post<Array<AppCollateralObj>>(AdInsConstant.GetListAppCollateralByAppId, AppIdObj).subscribe(
      (response) => {
        this.AppCollateralObj = response["ReturnObject"];
        console.log("this.AppCollateralObj");
        console.log(this.AppCollateralObj);
      });
  }
}
