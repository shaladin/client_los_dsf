import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-multi-coll-data',
  templateUrl: './multi-coll-data.component.html',
  styleUrls: ['./multi-coll-data.component.scss']
})
export class MultiCollDataComponent implements OnInit {

  @Input() AppId: number;
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
}
