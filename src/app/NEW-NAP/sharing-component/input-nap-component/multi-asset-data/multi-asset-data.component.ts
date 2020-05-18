import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core'; 
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
 
 
@Component({
  selector: 'app-multi-asset-data',
  templateUrl: './multi-asset-data.component.html',
  providers: [NGXToastrService]
})
export class MultiAssetDataComponent implements OnInit {
  @Output() OutputMultiAsset: EventEmitter<any> = new EventEmitter<any>();
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
    if(this.mode == 'submit'){
      this.OutputMultiAsset.emit();
    }
    console.log(ev);
    this.mode = ev.mode; 
    //this.AppId =  ev.AppId;
    //this.type = "addAsset";
    this.AppAssetId = ev.AppAssetId;
    this.AppCollateralId = ev.AppCollateralId;
  }

  terimaCollateral(ev : any){
    console.log(ev);
    this.mode = ev.mode; 
    //this.AppId =  ev.AppId;
    this.AppCollateralId = ev.AppCollateralId;
  }
}
