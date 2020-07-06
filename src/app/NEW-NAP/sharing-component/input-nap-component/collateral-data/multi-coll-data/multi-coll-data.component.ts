import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

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
  AppCollateral: any;
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  constructor(private toastr : NGXToastrService) { }

  ngOnInit() {
  }
  GetList(ev) {
    this.AppCollateral = ev;
  }

  Cancel(){
    this.outputCancel.emit();
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
    if (this.AppCollateral.length == 0) {
      this.toastr.warningMessage("Please Input At Least 1 Collateral Data");
    }
    else {
      this.outputTab.emit();
    }
  }
}
