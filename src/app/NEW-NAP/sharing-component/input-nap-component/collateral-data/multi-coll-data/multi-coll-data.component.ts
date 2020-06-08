import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
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
  constructor(private http: HttpClient, private toastr : NGXToastrService) { }

  ngOnInit() {
    // var obj = {
    //   AppId: this.AppId,
    // }
    // var getListUrl = AdInsConstant.GetAppCollateralByAppId;
    // this.http.post(getListUrl, obj).subscribe(
    //   (response) => {
    //     this.AppCollateral = response;
    //     console.log(response);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }
  GetList(ev) {
    this.AppCollateral = ev;
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
    console.log(this.AppCollateral);
    if (this.AppCollateral.length == 0) {
      this.toastr.errorMessage("Please Input At Least 1 Collateral Data");
    }
    else {
      this.outputTab.emit();
    }
  }
}
