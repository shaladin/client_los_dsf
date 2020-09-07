import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { map, mergeMap } from 'rxjs/operators';
import { AppObj } from 'app/shared/model/App/App.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

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
  IsCollateral: boolean = false;

  constructor(private toastr : NGXToastrService, private http: HttpClient) { }

  ngOnInit() {
    this.http.post(URLConstant.GetAppById, { AppId: this.AppId }).pipe(
      map((response: AppObj) => {
        return response;
      }),
      mergeMap((response: AppObj) => {
        var obj = {
          ProdOfferingCode: response.ProdOfferingCode,
          RefProdCompntCode: CommonConstant.CollateralNeeded,
          ProdOfferingVersion: response.ProdOfferingVersion
        };
        return this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj);
      })
    ).subscribe(
      (response) => {
        var isCollateralNeeded = response["CompntValue"];
        if(isCollateralNeeded == 'Y'){
          this.IsCollateral = true;
        }
        else{
          this.IsCollateral = false;
        }
      },
      (error) => {
        console.log(error);
      }
    );
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
    if(this.IsCollateral){
      if (this.AppCollateral.length == 0) {
        this.toastr.warningMessage(ExceptionConstant.INPUT_MIN_1_COLLATERAL_DATA);
      }
      else {
        this.outputTab.emit();
      }
    }
    else{
      this.outputTab.emit();
    }
  }

}
