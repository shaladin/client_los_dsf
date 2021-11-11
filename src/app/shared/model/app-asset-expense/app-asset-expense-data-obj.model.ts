import { AppAssetFeeOplObj } from "./app-asset-fee-opl-obj.model";
import { AppAssetInsOplObj } from "./app-asset-ins-opl-obj.model";
import { AppAssetMaintHObj } from "./app-asset-maint-h-obj.model";
import { AppAssetOthExpenseOplObj } from "./app-asset-oth-expense-opl-obj.model";

export class AppAssetExpenseDataObj {
  AppAssetId: number;
  AppAssetMaintHObj: AppAssetMaintHObj;
  AppAssetOthExpenseOplObjs: Array<AppAssetOthExpenseOplObj>;
  AppAssetFeeOplObjs: Array<AppAssetFeeOplObj>;
  AppAssetInsOplObj: AppAssetInsOplObj;
  RowVersion: string;

  constructor() {
    this.AppAssetId = 0;
    this.AppAssetMaintHObj = new AppAssetMaintHObj();
    this.AppAssetOthExpenseOplObjs = new Array<AppAssetOthExpenseOplObj>();
    this.AppAssetFeeOplObjs = new Array<AppAssetFeeOplObj>();
    this.AppAssetInsOplObj = new AppAssetInsOplObj();
    this.RowVersion = "";
  }
}
