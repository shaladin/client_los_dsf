import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-multi-collateral-paging',
  templateUrl: './multi-collateral-paging.component.html'
})
export class MultiCollateralPagingComponent implements OnInit {
  @Input() AppId: number;
  @Input() BLCode: string = "";
  @Output() select: EventEmitter<number> = new EventEmitter<number>();
  @Output() list: EventEmitter<Array<AppCollateralObj>> = new EventEmitter<Array<AppCollateralObj>>();
  ListAppCollObj: Array<AppCollateralObj> = new Array<AppCollateralObj>();

  constructor(private http: HttpClient, private toastr: NGXToastrService) {
  }

  ngOnInit() {
    this.GetListAppCollateralByAppId();
  }

  GetListAppCollateralByAppId() {
    var AppCollObj = {
      Id: this.AppId,
    }
    this.http.post<Array<AppCollateralObj>>(URLConstant.GetListAppCollateralByAppId, AppCollObj).subscribe(
      (response) => {
        this.ListAppCollObj = response[CommonConstant.ReturnObj];
        this.list.emit(this.ListAppCollObj);
      });
  }

  editData(AppCollateralId: number){
    this.select.emit(AppCollateralId);
  }

  deleteData(AppCollateralId: number){
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
    this.http.post(URLConstant.DeleteAppCollateral, {AppCollateralId: AppCollateralId}).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.GetListAppCollateralByAppId();
      });
    }
  }
}
