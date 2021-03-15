import { AppAssetFeeOplObj } from "./AppAssetFeeOplObj.Model";
import { AppAssetInsOplObj } from "./AppAssetInsOplObj.Model";
import { AppAssetMaintHObj } from "./AppAssetMaintHObj.Model";
import { AppAssetOthExpenseOplObj } from "./AppAssetOthExpenseOplObj.Model";

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
