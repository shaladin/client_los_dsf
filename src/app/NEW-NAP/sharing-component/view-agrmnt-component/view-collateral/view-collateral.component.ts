import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';

@Component({
  selector: 'agrmnt-view-collateral',
  templateUrl: './view-collateral.component.html'
})
export class ViewCollateralComponent implements OnInit {

  @Input() agrmntId: number = 0;
  appAssetList: Array<AppAssetObj> = new Array<AppAssetObj>();

  constructor( private http: HttpClient ) { }

  ngOnInit() {
    var AgrmntObj = {
      AgrmntId: this.agrmntId
    }
    this.http.post<Array<AppAssetObj>>(AdInsConstant.GetAppAssetListByAgrmntIdForViewAgrmnt, AgrmntObj).subscribe(
      (response) => {
        this.appAssetList = response["ReturnObject"];
        console.log(this.appAssetList);
      });
  }
}
