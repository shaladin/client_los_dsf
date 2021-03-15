import { AppAssetMaintDObj } from "./AppAssetMaintDObj.Model";

export class AppAssetMaintHObj {
  AppAssetId: number;
  MrMaintPackageCode: string;
  TotalServiceAmt: number;
  TotalSparepartAmt: number;
  ServiceObjs: Array<AppAssetMaintDObj>;
  SparepartObjs: Array<AppAssetMaintDObj>;
  RowVersion: string;
  AppAssetMaintBehaviourCode: string;
  IsAddable: boolean;

  constructor() {
    this.AppAssetId = 0;
    this.MrMaintPackageCode = "";
    this.TotalServiceAmt = 0;
    this.TotalSparepartAmt = 0;
    this.ServiceObjs = new Array<AppAssetMaintDObj>();
    this.SparepartObjs = new Array<AppAssetMaintDObj>();
    this.AppAssetMaintBehaviourCode = "";
    this.IsAddable = false;
    this.RowVersion = "";
  }
}
