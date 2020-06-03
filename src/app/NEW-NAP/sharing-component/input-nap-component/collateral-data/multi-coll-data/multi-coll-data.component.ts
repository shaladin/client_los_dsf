import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-multi-coll-data',
  templateUrl: './multi-coll-data.component.html',
  styleUrls: ['./multi-coll-data.component.scss']
})
export class MultiCollDataComponent implements OnInit {

  @Input() AppId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter<any>();
  AppCollateralId: number = 0;
  mode: string = "add";
  IsDetail: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  OpenDetail(AppCollateralId: number = 0) {
    if (AppCollateralId != 0) {
      this.AppCollateralId = AppCollateralId;
      this.mode = "edit";
    } else {
      this.mode = "add";
    }
    this.IsDetail = true;
  }

  CloseDetail() {
    this.IsDetail = false;
  }

  Next() {
    this.outputTab.emit();
  }
}
