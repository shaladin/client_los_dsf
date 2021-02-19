import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
 
@Component({
  selector: 'app-multi-asset-data',
  templateUrl: './multi-asset-data.component.html',
  providers: [NGXToastrService]
})
export class MultiAssetDataComponent implements OnInit {
  @Input() AppId: any;
  @Input() showCancel: boolean = true;
  @Input() BizTemplateCode: string = "";
  @Output() OutputMultiAsset: EventEmitter<any> = new EventEmitter<any>();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  mode: any = "paging";
  AppAssetId: any;
  AppCollateralId: any;
  type: any;

  constructor() {}

  ngOnInit() {
    this.mode = "paging";
  }

  terimaValue(ev : any) {
    this.mode = ev.mode;
    //this.AppId =  ev.AppId;
    //this.type = "addAsset";
    this.AppAssetId = ev.AppAssetId;
    this.AppCollateralId = ev.AppCollateralId;
    if(this.mode == 'submit') {
      this.OutputMultiAsset.emit();
    }
  }

  Cancel() {
    this.outputCancel.emit();
  }

  getOutputTab() {
    this.outputTab.emit();
  }

  terimaCollateral(ev : any) {
    this.mode = ev.mode;
    //this.AppId =  ev.AppId;
    this.AppCollateralId = ev.AppCollateralId;
  }
}