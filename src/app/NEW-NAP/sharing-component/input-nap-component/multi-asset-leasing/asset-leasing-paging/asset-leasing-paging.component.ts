import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';

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
  getListAppAssetData: any;
  gridAssetDataObj: any;
  gridAppCollateralObj: any;
  getListAppCollateral: any;
  AppAssetId: number;
  AppCollateralId: number;
  AppId: number;
  editAsset: string;
  editColl: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) { 
    this.getListAppAssetData = URLConstant.GetListAppAssetData;
    this.getListAppCollateral = URLConstant.GetListAppCollateral;

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
  console.log("test");
  console.log(ev);
  this.AppAssetId = ev.RowObj.AppAssetId;
  this.AppId = ev.RowObj.AppId;
  this.editAsset = ev.RowObj.editAsset;
  this.outputValue.emit({ mode: 'editAsset', AppAssetId: this.AppAssetId });
  console.log("CHECK EVENT");
}

eventColl(ev){
  if(ev.Key == "edit")
  {
    this.AppCollateralId = ev.RowObj.AppCollateralId;
    this.AppId = ev.RowObj.AppId;
    this.editColl = ev.RowObj.editColl;
    this.AppAssetId = ev.RowObj.AppAssetId;
    this.outputValue.emit({ mode: 'editColl', AppCollateralId: this.AppCollateralId });
    console.log("CHECK EVENT");
  }

  if(ev.Key == "delete")
  {
    if (confirm("Are you sure to delete this record?")) {
      var collateralObj = new AppCollateralObj();
      collateralObj.AppCollateralId = ev.RowObj.AppCollateralId;
      console.log("qwe")
      console.log(collateralObj.AppCollateralId)
      this.http.post(URLConstant.DeleteAppCollateral, collateralObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.listAppCollateralObj = response["ReturnObject"];

          var DetailForGridCollateral ={
            Data: response["ReturnObject"],
            Count: "0"
          }

          this.gridAppCollateralObj.resultData = DetailForGridCollateral;

        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}

  ngOnInit() {
    this.gridAssetDataObj = new InputGridObj();
    this.gridAssetDataObj.pagingJson = "./assets/ucgridview/gridAssetData.json";
    
    this.appAssetObj = new AppAssetObj();
    this.appAssetObj.AppAssetId = "-";
    this.http.post(this.getListAppAssetData, this.appAssetObj).subscribe(
      (response) => {
          this.listAppAssetObj = response["ReturnObject"];

          var DetailForGridAsset ={
            Data: response["ReturnObject"],
            Count: "0"
          }

        this.gridAssetDataObj.resultData = DetailForGridAsset;
      },
      (error) => {
        console.log(error);
      }
    );

    this.gridAppCollateralObj = new InputGridObj();
    this.gridAppCollateralObj.pagingJson = "./assets/ucgridview/gridAppCollateral.json";
    this.gridAppCollateralObj.deleteUrl = URLConstant.DeleteAppCollateral;
    
    this.appCollateralObj = new AppCollateralObj();
    this.appCollateralObj.AppCollateralId = "-";
    this.http.post(this.getListAppCollateral, this.appCollateralObj).subscribe(
      (response) => {
          this.listAppCollateralObj = response["ReturnObject"];

          var DetailForGridCollateral ={
            Data: response["ReturnObject"],
            Count: "0"
          }

        this.gridAppCollateralObj.resultData = DetailForGridCollateral;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editItem(custAddrObj: any) {
    this.outputValue.emit({ mode: 'edit', AddrId: custAddrObj.CustAddrId });
  }

  // deleteItem(custAddrObj: any) {
  //   var custAddr = new CustAddrObj();
  //   custAddr.CustAddrId = custAddrObj.CustAddrId;
  //   this.http.post(this.deleteCustAddr, custAddr).subscribe(
  //     (response: any) => {
  //       this.toastr.successMessage(response["message"]);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  //   //this.outputValue.emit({ mode: 'edit', AddrId: custAddrObj.CustAddrId });
  // }

}
