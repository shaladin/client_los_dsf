import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AssetExpenseObj } from 'app/shared/model/app-asset-opl/asset-expense-obj.model';

@Component({
  selector: 'app-asset-expense',
  templateUrl: './asset-expense.component.html'
})
export class AssetExpenseComponent implements OnInit {
  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  listAppAssetObj: Array<AssetExpenseObj>;
  listAppCollateralObj: Array<AppCollateralObj> = new Array();
  gridAssetDataObj: InputGridObj;
  AppAssetId: number;
  isEdit: boolean = false;
  isReady: boolean = false;

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService) {
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
    this.getListDataAsset();
  }

  getListDataAsset() {
    this.isReady = false;
    var appAssetObj = { Id: this.AppId };
    this.http.post(URLConstant.GetListAppAssetExpenseByAppId, appAssetObj).subscribe(
      (response: {AssetExpenseObjs: Array<AssetExpenseObj>}) => {
        this.listAppAssetObj = response.AssetExpenseObjs;
        var DetailForGridAsset = {
          Data: this.listAppAssetObj
        }

        this.gridAssetDataObj.resultData = DetailForGridAsset;
        this.isReady = true;
      }
    );
  }

  next() {
    var x = this.listAppAssetObj.filter(w => w.TotalAssetExpense == 0)
    if (x.length > 0) {
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
    this.AppAssetId = this.listAppAssetObj[0].AppAssetId;
    this.isEdit = true;
  }
}