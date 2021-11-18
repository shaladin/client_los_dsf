import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
 
@Component({
  selector: 'app-multi-asset-data',
  templateUrl: './multi-asset-data.component.html',
  providers: [NGXToastrService]
})
export class MultiAssetDataComponent implements OnInit {
  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Input() BizTemplateCode: string = "";
  @Output() OutputMultiAsset: EventEmitter<any> = new EventEmitter<any>();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  mode: string = "paging";
  AppAssetId: number;
  AppCollateralId: number;
  // type: any;

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

  readonly ModeAddColl = CommonConstant.ModeAddColl;
  readonly ModeEditColl = CommonConstant.ModeEditColl;
  terimaCollateral(ev : any) {
    this.mode = ev.mode;
    //this.AppId =  ev.AppId;
    this.AppCollateralId = ev.AppCollateralId;
  }
}