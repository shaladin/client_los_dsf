import { Component, OnInit, Input } from '@angular/core';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-app-collateral-multi',
  templateUrl: './view-app-collateral-multi.component.html'
})
export class ViewAppCollateralMultiComponent implements OnInit {
  @Input() agrmntId: number = 0;
  AppCollateralObj: Array<AppCollateralObj> = new Array<AppCollateralObj>();
  IsHidden: boolean = true;
  AppCollateralId: number;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.post<Array<AppCollateralObj>>(URLConstant.GetListAppCollateralByAgrmntId, {AgrmntId: this.agrmntId}).subscribe(
      (response) => {
        this.AppCollateralObj = response["ReturnObject"];
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
