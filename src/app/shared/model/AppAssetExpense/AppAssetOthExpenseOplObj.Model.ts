import { AppAssetMaintHObj } from "./AppAssetMaintHObj.Model";

export class AppAssetOthExpenseOplObj {
  AppAssetId: number;
  MrOthExpenseTypeOplCode: string;
  OthExpenseAmt: number;
  OthExpBehaviourCode: string;
  IsAddable: boolean;
  RowVersion: string;

  constructor() {
    this.AppAssetId = 0;
    this.MrOthExpenseTypeOplCode = "";
    this.OthExpenseAmt = 0;
    this.OthExpBehaviourCode = "";
    this.IsAddable = false;
    this.RowVersion = "";
  }
}
