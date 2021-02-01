export class AppAssetSupplEmpObj {
  AppAssetSupplEmpId: number;
  AppAssetId: number;
  SupplEmpNo: string;
  SupplEmpName: string;
  MrSupplEmpPositionCode: string;
  MrSupplEmpPositionCodeDesc: string;
  ReportToSupplEmpNo: string;
  VendorEmpId: number;
  RowVersion: string;

  constructor() {
    this.AppAssetSupplEmpId = 0;
    this.AppAssetId = 0;
    this.SupplEmpNo = "";
    this.SupplEmpName = "";
    this.MrSupplEmpPositionCode = "";
    this.ReportToSupplEmpNo = "";
    this.VendorEmpId = 0;
    this.RowVersion = "";
  }
}
