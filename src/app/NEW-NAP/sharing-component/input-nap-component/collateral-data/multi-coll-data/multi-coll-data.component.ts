import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';

@Component({
  selector: 'app-multi-coll-data',
  templateUrl: './multi-coll-data.component.html',
  styleUrls: ['./multi-coll-data.component.scss']
})
export class MultiCollDataComponent implements OnInit {

  @Input() AppId: number;
  @Input() BLCode: string = "";
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  AppCollateralId: number = 0;
  mode: string = "add";
  IsDetail: boolean = false;
  AppCollateral: Array<AppCollateralObj> = new Array<AppCollateralObj>();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  constructor(private toastr : NGXToastrService) { }

  isMultiCollPaging: boolean = false;
  ngOnInit() {
    console.log(this.BLCode);
    this.isMultiCollPaging = true;
  }
  GetList(ev: Array<AppCollateralObj>) {
    this.AppCollateral = ev;
    console.log(this.AppCollateral);
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
      this.toastr.warningMessage(ExceptionConstant.INPUT_MIN_1_COLLATERAL_DATA);
    }
    else {
      this.outputTab.emit();
    }
  }
}
