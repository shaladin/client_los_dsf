import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-collateral-data-cfna',
  templateUrl: './collateral-data-cfna.component.html',
  styles: []
})
export class CollateralDataCfnaComponent implements OnInit {
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
      this.toastr.warningMessage(ExceptionConstant.INPUT_MIN_1_COLLATERAL_DATA);
    }
    else {
      this.outputTab.emit();
    }
  }

}
