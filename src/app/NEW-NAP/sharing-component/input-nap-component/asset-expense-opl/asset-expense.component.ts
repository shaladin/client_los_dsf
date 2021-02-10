import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-asset-expense',
  templateUrl: './asset-expense.component.html'
})
export class AssetExpenseComponent implements OnInit {
  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  appAssetObj: any;
  listDataAsset: Array<any> = new Array();
  listAppAssetObj: any;
  appCollateralObj: any;
  listAppCollateralObj: Array<AppCollateralObj> = new Array();
  gridAssetDataObj: any;
  AppAssetId: number;
  isEdit: boolean = false;
  isReady: boolean = false;
  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
    });
  }

  Cancel() {
    this.outputCancel.emit();
  }

  event(ev) {
    if (ev.Key == "edit") {
      this.AppAssetId = ev.RowObj.AppAssetId
      this.isEdit = true;
    }
  }

  ngOnInit() {
    this.gridAssetDataObj = new InputGridObj();
    this.gridAssetDataObj.pagingJson = "./assets/ucgridview/gridAssetExpense.json";
    this.appAssetObj = new AppAssetObj();
    this.appAssetObj.AppId = this.AppId;
    this.getListDataAsset();
  }

  getListDataAsset() {
    this.isReady = false;
    this.http.post(URLConstant.GetListAppAssetExpenseByAppId, this.appAssetObj).subscribe(
      (response) => {
        this.listAppAssetObj = response;
        console.log(this.listAppAssetObj);
        var DetailForGridAsset = {
          Data: this.listAppAssetObj.AssetExpenseObjs
        }

        this.gridAssetDataObj.resultData = DetailForGridAsset;
        this.isReady = true;
      });
  }

  next() {
    var x = this.listAppAssetObj.AssetExpenseObjs.filter(w => w.TotalAssetExpense == 0)
    if (x.length > 0)
    {
      this.toastr.warningMessage("Please Input Asset Expense For All Asset");
      return;
    }
    else {
      this.outputValue.emit();
    }
  }

  paging() {
    this.getListDataAsset();
    this.isEdit = false;
  }

  test() {

    this.AppAssetId = this.listAppAssetObj.AssetExpenseObjs[0].AppAssetId;
      this.isEdit = true;

  }
}
