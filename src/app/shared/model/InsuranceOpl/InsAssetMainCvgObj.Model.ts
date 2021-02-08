import { InsAssetAddCvgObj } from "./InsAssetAddCvgObj.Model";

export class InsAssetMainCvgObj {
  MrMainCvgTypeCode: string;
  YearNo: number;
  Tenor: number;
  SumInsuredPrcnt: number;
  SumInsuredAmt: number;
  InscoMainPremiRate: number;
  CustMainPremiRate: number;
  InscoMainPremiAmt: number;
  CustMainPremiAmt: number;
  TotalInscoAddPremiAmt: number;
  TotalCustAddPremiAmt: number;
  CustPremiPaidAmt: number;
  TotalCustDiscAmt: number;
  TotalInscoDiscAmt: number;
  ListInsAssetAddCvg: Array<InsAssetAddCvgObj>;

  constructor() {
    this.ListInsAssetAddCvg = new Array<InsAssetAddCvgObj>();
  }
}
