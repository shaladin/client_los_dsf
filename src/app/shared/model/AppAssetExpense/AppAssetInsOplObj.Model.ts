import { AppAssetInsFeeOplObj } from "./AppAssetInsFeeOplObj.Model";
import { AppAssetInsMainCvgOplObj } from "./AppAssetInsMainCvgOplObj.Model";


export class AppAssetInsOplObj {
  AppAssetId: number;
  InscoBranchCode: string;
  InsAssetRegion: string;
  MrInsCoverPeriodCode: string;
  CvgAmt: number;
  InsLength: number;
  TotalInscoMainPremiAmt: number;
  TotalInscoAddPremiAmt: number;
  TotalInscoFeeAmt: number;
  TotalInsInscoAmt: number;
  Notes: string;
  AppAssetInsMainCvgOplObjs : Array<AppAssetInsMainCvgOplObj>;
  AppAssetInsFeeOplObjs: Array<AppAssetInsFeeOplObj>;
  RowVersion: string;

  constructor() {
    this.AppAssetId = 0;
    this.InscoBranchCode = "";
    this.InsAssetRegion = "";
    this.MrInsCoverPeriodCode = "";
    this.CvgAmt = 0;
    this.InsLength = 0;
    this.TotalInscoMainPremiAmt = 0;
    this.TotalInscoAddPremiAmt = 0;
    this.TotalInscoFeeAmt = 0;
    this.TotalInsInscoAmt = 0;
    this.Notes = "";
    this.AppAssetInsMainCvgOplObjs = new Array<AppAssetInsMainCvgOplObj>();
    this.AppAssetInsFeeOplObjs = new Array<AppAssetInsFeeOplObj>();
    this.RowVersion = "";
  }
}
