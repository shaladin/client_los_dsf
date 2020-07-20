import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-view-collateral-multi-asset',
  templateUrl: './view-collateral-multi-asset.component.html'
})
export class ViewCollateralMultiAssetComponent implements OnInit {

  @Input() appId: number;
  @Input() IsMulti: boolean = false;
  AppCollateralObj: Array<AppCollateralObj> = new Array<AppCollateralObj>();
  IsHidden: boolean = true;
  AppCollateralId: number;

  constructor(private http: HttpClient, private router : Router) { }

  ngOnInit() {
    var AppIdObj = {
      AppId: this.appId
    }
    this.http.post<Array<AppCollateralObj>>(URLConstant.GetListAppCollateralByAppId, AppIdObj).subscribe(
      (response) => {
        this.AppCollateralObj = response[CommonConstant.ReturnObj];
      });
  }

  viewDetailHandler(AppCollateralId){
    this.IsHidden = false;
    this.AppCollateralId = AppCollateralId;
  }

  getValue(event){
    this.IsHidden = event;
  }
}
