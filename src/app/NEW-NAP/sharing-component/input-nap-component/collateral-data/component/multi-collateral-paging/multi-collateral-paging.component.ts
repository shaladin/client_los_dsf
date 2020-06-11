import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';

@Component({
  selector: 'app-multi-collateral-paging',
  templateUrl: './multi-collateral-paging.component.html',
  styleUrls: ['./multi-collateral-paging.component.scss']
})
export class MultiCollateralPagingComponent implements OnInit {
  @Input() AppId: number;
  @Output() select: EventEmitter<number> = new EventEmitter<any>();
  @Output() list: EventEmitter<any> = new EventEmitter<any>();
  ListAppCollObj: Array<AppCollateralObj> = new Array<AppCollateralObj>();

  constructor(private http: HttpClient, private toastr: NGXToastrService) {
  }

  ngOnInit() {
    this.GetListAppCollateralByAppId()
  }

  GetListAppCollateralByAppId() {
    var AppCollObj = {
      AppId: this.AppId,
    }
    this.http.post<Array<AppCollateralObj>>(AdInsConstant.GetListAppCollateralByAppId, AppCollObj).subscribe(
      (response) => {
        this.ListAppCollObj = response["ReturnObject"];
        this.list.emit(this.ListAppCollObj);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editData(AppCollateralId: number){
    this.select.emit(AppCollateralId);
  }
}