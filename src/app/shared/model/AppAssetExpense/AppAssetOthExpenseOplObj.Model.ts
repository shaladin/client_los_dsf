import { AppAssetMaintHObj } from "./AppAssetMaintHObj.Model";

export class AppAssetOthExpenseOplObj {
  AppAssetId: number;
  MrOthExpenseTypeOplCode: string;
  OthExpenseAmt: number;

  RowVersion: string;

  constructor() {
    this.AppAssetId = 0;
    this.MrOthExpenseTypeOplCode = "";
    this.OthExpenseAmt = 0;
    this.RowVersion = "";
  }
}
