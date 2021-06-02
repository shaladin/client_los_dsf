import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { map, mergeMap } from 'rxjs/operators';
import { AppObj } from 'app/shared/model/App/App.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/Request/Product/ReqGetProdOfferingObj.model';

@Component({
  selector: 'app-collateral-data-cfna',
  templateUrl: './collateral-data-cfna.component.html',
  styles: []
})
export class CollateralDataCfnaComponent implements OnInit {
  @Input() AppId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter<any>();
  ParentAppId: number;
  AppCollateralId: number = 0;
  mode: string = "add";
  IsDetail: boolean = false;
  AppCollateral: any;
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  IsCollateral: boolean = false;
  @Input() showCancel: boolean = true;
  appNo: string;
  isAgreementParent: boolean = false;
  isReady: boolean = false;
  isInit;

  constructor(private toastr: NGXToastrService, private http: HttpClient) { }

  ngOnInit() {
    this.http.post(URLConstant.GetAppById, { Id: this.AppId }).pipe(
      map((response: AppObj) => {
        return response;
      }),
      mergeMap((response: AppObj) => {
        this.appNo = response.AppNo
        var obj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
        obj.ProdOfferingCode = response.ProdOfferingCode;
        obj.RefProdCompntCode = CommonConstant.CollateralNeeded;
        obj.ProdOfferingVersion = response.ProdOfferingVersion;

        return this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, obj);
      }),
      mergeMap((response) => {
        var isCollateralNeeded = response["CompntValue"];
        if (isCollateralNeeded == 'Y') {
          this.IsCollateral = true;
        }
        else {
          this.IsCollateral = false;
        }
        var obj = {
          AppNo: this.appNo
        }
        return this.http.post(URLConstant.GetParentAppIdByAppNo, obj);
      }
      )
    ).subscribe(
      (response) => {
        if (response["AppId"] != 0)
          this.ParentAppId = response["AppId"];
        this.isReady = true;
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

  getIsFirstInit(ev) {
    this.isInit = ev;
  }
  Next() {
    console.log(this.isInit)
    if (this.isInit == true) {
      var obj = {
        AppId: this.AppId,
        ParentAppId: this.ParentAppId
      }

      this.http.post(URLConstant.CopyAppCollateralFromAgrmntParent, obj).subscribe(
        (response) => {
          this.outputTab.emit();
        })
    }
    else {
      this.outputTab.emit();
    }

    // if (this.IsCollateral) {
    //   if (this.AppCollateral.length == 0) {
    //     this.toastr.warningMessage(ExceptionConstant.INPUT_MIN_1_COLLATERAL_DATA);
    //   }
    //   else {
    //     this.outputTab.emit();
    //   }
    // }
    // else {
    //   this.outputTab.emit();
    // } 


  }

}
