import { Component, OnInit, ViewChild, Input } from '@angular/core'; 
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
 
 
@Component({
  selector: 'app-multi-asset-leasing',
  templateUrl: './multi-asset-leasing.component.html',
  providers: [NGXToastrService]
})
export class MultiAssetLeasingComponent implements OnInit {
 
  mode: any;
  AppId:any;
  AppAssetId:any;
  AppCollateralId: any;
  type:any;
  constructor( ) {  
  }

  ngOnInit() { 
    this.mode = "paging";
  }

  terimaValue(ev : any){
    this.mode = ev.mode; 
    //this.AppId =  ev.AppId;
    //this.type = "addAsset";
    this.AppAssetId = ev.AppAssetId;
    this.AppCollateralId = ev.AppCollateralId;
  }

  terimaCollateral(ev : any){
    this.mode = ev.mode; 
    //this.AppId =  ev.AppId;
    this.AppCollateralId = ev.AppCollateralId;
  }
}
