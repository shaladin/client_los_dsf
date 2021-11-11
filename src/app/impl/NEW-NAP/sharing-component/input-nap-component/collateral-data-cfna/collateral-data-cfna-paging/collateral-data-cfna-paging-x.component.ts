import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';

@Component({
  selector: 'app-collateral-data-cfna-paging-x',
  templateUrl: './collateral-data-cfna-paging-x.component.html',
  styles: []
})
export class CollateralDataCfnaPagingXComponent implements OnInit {
  @Input() AppId: number;
  @Input() ParentAppId: number;
  @Output() select: EventEmitter<number> = new EventEmitter<number>();
  @Output() list: EventEmitter<any> = new EventEmitter<any>();
  ListAppCollObj: Array<AppCollateralObj> = new Array<AppCollateralObj>();
  @Output() emitIsFirstInit: EventEmitter<boolean> = new EventEmitter<boolean>();
  isFirstInit: boolean = false;
  constructor(private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    this.GetListAppCollateralByAppId();
    this.emitIsFirstInit.emit(this.isFirstInit);
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
  editData(AppCollateralId: number) {
    this.select.emit(AppCollateralId);
  }
  deleteData(AppCollateralId: number) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.http.post(URLConstant.DeleteAppCollateral, { AppCollateralId: AppCollateralId }).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.GetListAppCollateralByAppId();
        });
    }
  }

}
