import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-asset-leasing-paging',
  templateUrl: './asset-leasing-paging.component.html'
})
export class AssetLeasingPagingComponent implements OnInit {

  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  IdCust: number;
  appAssetObj : any;
  listAppAssetObj: any;
  appCollateralObj: any;
  listAppCollateralObj: any;
  gridAssetDataObj: any;
  gridAppCollateralObj: any;
  AppAssetId: number;
  AppCollateralId: number;
  AppId: number;
  editAsset: string;
  editColl: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) { 

    this.route.queryParams.subscribe(params => {
      if (params["IdCust"] != null) {
         this.IdCust = params["IdCust"];
       }
     });
  }

  
addAsset() {
  this.outputValue.emit({ mode: 'addAsset' });
}

addColl() {
  this.outputValue.emit({ mode: 'addColl' });
}

event(ev){
  this.AppAssetId = ev.RowObj.AppAssetId;
  this.AppId = ev.RowObj.AppId;
  this.editAsset = ev.RowObj.editAsset;
  this.outputValue.emit({ mode: 'editAsset', AppAssetId: this.AppAssetId });
}

eventColl(ev){
  if(ev.Key == "edit")
  {
    this.AppCollateralId = ev.RowObj.AppCollateralId;
    this.AppId = ev.RowObj.AppId;
    this.editColl = ev.RowObj.editColl;
    this.AppAssetId = ev.RowObj.AppAssetId;
    this.outputValue.emit({ mode: 'editColl', AppCollateralId: this.AppCollateralId });
  }

  if(ev.Key == "delete")
  {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var collateralObj = new AppCollateralObj();
      collateralObj.AppCollateralId = ev.RowObj.AppCollateralId;
      this.http.post(URLConstant.DeleteAppCollateral, collateralObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.listAppCollateralObj = response[CommonConstant.ReturnObj];

          var DetailForGridCollateral ={
            Data: response[CommonConstant.ReturnObj],
            Count: "0"
          }

          this.gridAppCollateralObj.resultData = DetailForGridCollateral;

        });
    }
  }
}

  ngOnInit() {
    this.gridAssetDataObj = new InputGridObj();
    this.gridAssetDataObj.pagingJson = "./assets/ucgridview/gridAssetData.json";
    
    this.http.post(URLConstant.GetListAppAssetData, {}).subscribe(
      (response) => {
          this.listAppAssetObj = response[CommonConstant.ReturnObj];

          var DetailForGridAsset ={
            Data: response[CommonConstant.ReturnObj],
            Count: "0"
          }

        this.gridAssetDataObj.resultData = DetailForGridAsset;
      });

    this.gridAppCollateralObj = new InputGridObj();
    this.gridAppCollateralObj.pagingJson = "./assets/ucgridview/gridAppCollateral.json";
    this.gridAppCollateralObj.deleteUrl = URLConstant.DeleteAppCollateral;
    
    this.appCollateralObj = new AppCollateralObj();
    this.appCollateralObj.AppCollateralId = "-";
    this.http.post(URLConstant.GetListAppCollateral, this.appCollateralObj).subscribe(
      (response) => {
          this.listAppCollateralObj = response[CommonConstant.ReturnObj];

          var DetailForGridCollateral ={
            Data: response[CommonConstant.ReturnObj],
            Count: "0"
          }

        this.gridAppCollateralObj.resultData = DetailForGridCollateral;
      });
  }

  editItem(custAddrObj: any) {
    this.outputValue.emit({ mode: 'edit', AddrId: custAddrObj.CustAddrId });
  }
}
