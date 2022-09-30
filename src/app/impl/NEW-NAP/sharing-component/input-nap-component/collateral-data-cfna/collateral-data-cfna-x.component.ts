import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { map, mergeMap } from 'rxjs/operators';
import { AppObj } from 'app/shared/model/App/App.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/request/product/req-get-prod-offering-obj.model';

@Component({
  selector: 'app-collateral-data-cfna-x',
  templateUrl: './collateral-data-cfna-x.component.html',
  styles: []
})
export class CollateralDataCfnaXComponent implements OnInit {
  @Input() AppId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter<any>();
  AppCollateralId: number = 0;
  mode: string = "add";
  IsDetail: boolean = false;
  AppCollateral: Array<any> = new Array<any>();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  IsCollateral: boolean = false;
  @Input() showCancel: boolean = true;
  constructor(private toastr: NGXToastrService, private http: HttpClient) { }

  ngOnInit() {
    this.http.post(URLConstant.GetAppById, { Id: this.AppId }).pipe(
      map((response: AppObj) => {
        return response;
      }),
      mergeMap((response: AppObj) => {
        var obj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
        obj.ProdOfferingCode = response.ProdOfferingCode;
        obj.RefProdCompntCode = CommonConstant.CollateralNeeded;
        obj.ProdOfferingVersion = response.ProdOfferingVersion;

        return this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj);
      })
    ).subscribe(
      (response) => {
        var isCollateralNeeded = response["CompntValue"];
        if (isCollateralNeeded == 'Y') {
          this.IsCollateral = true;
        }
        else {
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

  Cancel() {
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
    if (this.IsCollateral) {
      if (this.AppCollateral.length == 0) {
        this.toastr.warningMessage(ExceptionConstant.INPUT_MIN_1_COLLATERAL_DATA);
      }
      else {
        this.http.post(URLConstant.GetListAppLoanPurposeByAppId, { Id: this.AppId }).subscribe(
          (response) => {
            let loadObj = response["listResponseAppLoanPurpose"];

            const totalPortionAmt = this.AppCollateral.reduce((collateral, obj) => {
              return collateral + (obj.CollateralValueAmt * obj.CollateralPrcnt / 100);
            }, 0);

            const totalFinancingAmt = loadObj.reduce((loan, obj) => {
              return loan + obj.FinancingAmt;
            }, 0);

            if(totalFinancingAmt > totalPortionAmt){
              this.toastr.warningMessage(ExceptionConstant.FINANCING_AMT_MORE_THAN_COLL_PORTION_AMT);
              return;
            }
            this.outputTab.emit();
          });
      }
    }
    else {
      this.outputTab.emit();
    }
  }

}
