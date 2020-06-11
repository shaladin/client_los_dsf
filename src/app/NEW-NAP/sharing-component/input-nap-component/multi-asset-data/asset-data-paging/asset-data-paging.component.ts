import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { WizardComponent } from 'angular-archwizard';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';

@Component({
  selector: 'app-asset-data-paging',
  templateUrl: './asset-data-paging.component.html'
})
export class AssetDataPagingComponent implements OnInit {

  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  IdCust: any;
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
  @Input() AppId: number;
  editAsset: string;
  editColl: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) { 
    // this.getListAppAssetData = AdInsConstant.GetListAppAssetData;
    this.getListAppAssetData = AdInsConstant.GetAppAssetListByAppId;
    // this.getListAppCollateral = AdInsConstant.GetListAppCollateral;
    this.getListAppCollateral = AdInsConstant.GetListAppCollateralByAppId;

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
  if(ev.Key == "edit")
  {
    this.AppAssetId = ev.RowObj.AppAssetId;
    // this.AppId = ev.RowObj.AppId;
    this.editAsset = ev.RowObj.editAsset;
    this.outputValue.emit({ mode: 'editAsset', AppAssetId: this.AppAssetId });
    console.log("CHECK EVENT");
  }

  if(ev.Key == "delete")
  {
    if (confirm("Are you sure to delete this record?")) {
      var appAssetObj = new AppAssetObj();
      appAssetObj.AppAssetId = ev.RowObj.AppAssetId;
      appAssetObj.AppId = ev.RowObj.AppId;
      this.http.post(AdInsConstant.DeleteAppAsset, appAssetObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.listAppAssetObj = response["ReturnAsset"];

          var DetailForGridAsset ={
            Data: response["ReturnAsset"],
            Count: "0"
          }

          this.gridAssetDataObj.resultData = DetailForGridAsset;

          this.listAppCollateralObj = response["ReturnCollateral"];

          var DetailForGridCollateral ={
            Data: response["ReturnCollateral"],
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

eventColl(ev){
  if(ev.Key == "edit")
  {
    this.AppCollateralId = ev.RowObj.AppCollateralId;
    // this.AppId = ev.RowObj.AppId;
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
      collateralObj.AppId = this.AppId;
      console.log("qwe")
      console.log(collateralObj.AppCollateralId)
      this.http.post(AdInsConstant.DeleteAppCollateral, collateralObj).subscribe(
        (response) => {
          console.log(response);
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
    console.log("AppId: " + this.AppId);
    this.gridAssetDataObj = new InputGridObj();
    this.gridAssetDataObj.pagingJson = "./assets/ucgridview/gridAssetData.json";
    this.gridAssetDataObj.deleteUrl = AdInsConstant.DeleteAppAsset;
    
    this.appAssetObj = new AppAssetObj();
    // this.appAssetObj.AppAssetId = "-";
    this.appAssetObj.AppId = this.AppId;
    this.http.post(this.getListAppAssetData, this.appAssetObj).subscribe(
      (response) => {
          console.log("Response Asset : " + JSON.stringify(response));
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
    this.gridAppCollateralObj.deleteUrl = AdInsConstant.DeleteAppCollateral;
    
    this.appCollateralObj = new AppCollateralObj();
    // this.appCollateralObj.AppCollateralId = "-";
    this.appCollateralObj.AppId = this.AppId;
    this.http.post(this.getListAppCollateral, this.appCollateralObj).subscribe(
      (response) => {
          console.log("Collateral : " + JSON.stringify(response));
          this.listAppCollateralObj = response["ReturnObject"];

          var DetailForGridCollateral ={
            Data: response["ReturnObject"],
            Count: "0"
          }

        this.gridAppCollateralObj.resultData = DetailForGridCollateral;

        console.log("abc")
        console.log(this.gridAppCollateralObj.resultData.Data.length)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getGridCollateral(){
    this.gridAppCollateralObj = new InputGridObj();
    this.gridAppCollateralObj.pagingJson = "./assets/ucgridview/gridAppCollateral.json";
    this.gridAppCollateralObj.deleteUrl = AdInsConstant.DeleteAppCollateral;
    
    this.appCollateralObj = new AppCollateralObj();
    // this.appCollateralObj.AppCollateralId = "-";
    this.appCollateralObj.AppId = this.AppId;
    this.http.post(this.getListAppCollateral, this.appCollateralObj).subscribe(
      (response) => {
          this.listAppCollateralObj = response["ReturnObject"];

          var DetailForGridCollateral ={
            Data: response["ReturnObject"],
            Count: "0"
          }

        this.gridAppCollateralObj.resultData = DetailForGridCollateral;

        console.log("abc")
        console.log(this.gridAppCollateralObj.resultData.Data.length)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editItem(custAddrObj: any) {
    this.outputValue.emit({ mode: 'edit', AddrId: custAddrObj.CustAddrId });
  }

  next(){
    if(this.gridAppCollateralObj.resultData.Data.length < 1)
    {
      this.toastr.errorMessage("Asset minimum is 1");
      return;
    }
    else
    {
      this.outputValue.emit({mode: 'submit'});
    }
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
