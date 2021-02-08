import { InsAssetInsFeeObj } from "./InsAssetInsFeeObj.Model";
import { InsAssetMainCvgObj } from "./InsAssetMainCvgObj.Model";

export class InsAssetDataObj {
  AssetId: number;
  AgrmntNo: string;
  AssetNo: string;
  InscoBranchCode: string;
  InsAssetCoverPeriod: string;
  InsAssetCoveredBy: string;
  InsAssetPaidBy: string;
  MrInsPayMethodCode: string;
  MrCustPayMethodCode: string;
  MrInsPolicySrcCode: string;
  MrInsPolicyTypeCode: string;
  TotalInscoMainPremiAmt: number
  TotalInscoAddPremiAmt: number;
  TotalInscoFeeAmt: number;
  TotalInsInscoAmt: number;
  TotalCustMainPremiAmt: number;
  TotalCustAddPremiAmt: number;
  TotalCustDiscAmt: number;
  TotalInscoDiscAmt: number;
  TotalCustFeeAmt: number;
  TotalInsCustAmt: number;
  CustCvgAmt: number;
  CustInscoBranchName: string;
  CustNotes: string;
  Notes: string;
  MrCustCoverPeriodCode: string;
  CustCoverStartDt: Date;
  CustCoverEndDt: Date;
  PolicyStartDt: Date;
  PolicyEndDt: Date;
  InsLength: number;
  CvgAmt: number;
  InsCptlzAmt: number;
  InsAssetRegion: string;
  InsPolicyName: string;

  ListInsAssetMainCvg: Array<InsAssetMainCvgObj>;
  ListInsAssetFee: Array<InsAssetInsFeeObj>;
  RowVersion: string;

  constructor() {
    this.ListInsAssetMainCvg = new Array<InsAssetMainCvgObj>();
    this.ListInsAssetFee = new Array<InsAssetInsFeeObj>();
  }
}
