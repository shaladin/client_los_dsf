import { AppAssetInsAddCvgOplObj } from "./app-asset-ins-add-cvg-opl-obj.model";


export class AppAssetInsMainCvgOplObj {
  AppAssetInsOplId: number;
  MrMainCvgTypeCode: string;
  YearNo: number;
  Tenor: number;
  SumInsuredPrcnt: number;
  SumInsuredAmt: number;
  InscoMainPremiRate: number;
  InscoMainPremiAmt: number;
  TotalInscoAddPremiAmt: number;
  TotalInscoFeeAmt: number;
  TotalInsInscoAmt: number;
  AppAssetInsAddCvgOplObjs : Array<AppAssetInsAddCvgOplObj>;
    RowVersion: string;
  CustMainPremiRate: number;
  CustMainPremiAmt: number;
  TotalCustAddPremiAmt: number;
  constructor() {
    this.AppAssetInsOplId = 0;
    this.MrMainCvgTypeCode = "";
    this.YearNo = 0;
    this.Tenor = 0;
    this.SumInsuredPrcnt = 0;
    this.SumInsuredAmt = 0;
    this.InscoMainPremiRate = 0;
    this.InscoMainPremiAmt = 0;
    this.TotalInscoAddPremiAmt = 0;
    this.TotalInscoFeeAmt = 0;
    this.TotalInsInscoAmt = 0;
    this.AppAssetInsAddCvgOplObjs = new Array<AppAssetInsAddCvgOplObj>();
    this.RowVersion = "";
    this.CustMainPremiRate = 0;
    this.CustMainPremiAmt = 0;
    this.TotalCustAddPremiAmt = 0;
  }
}
