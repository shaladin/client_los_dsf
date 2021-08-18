import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-multi-asset-data-x',
  templateUrl: './multi-asset-data-x.component.html'
})
export class MultiAssetDataXComponent implements OnInit {
  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Input() BizTemplateCode: string;
  @Output() OutputMultiAsset: EventEmitter<any> = new EventEmitter<any>();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  mode: string = "paging";
  AppAssetId: number;

  constructor() { }

  ngOnInit() {
    this.mode = "paging";
  }

  terimaValue(ev : any) {
    this.mode = ev.mode;
    //this.AppId =  ev.AppId;
    //this.type = "addAsset";
    this.AppAssetId = ev.AppAssetId;
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

}
