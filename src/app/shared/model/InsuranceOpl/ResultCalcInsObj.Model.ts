import { ResultCalcInsMainCvgObj } from "./ResultCalcInsMainCvgObj.Model";

export class ResultCalcInsObj {
  InsCoverage: Array<ResultCalcInsMainCvgObj>;
  TotalMainPremiAmt: number;
  TotalAdditionalPremiAmt: number;
  TotalMainPremiToInscoAmt: number;
  TotalAdditionalPremiToInscoAmt: number;
  TotalFeeAmt: number;

  constructor() {
    this.InsCoverage = new Array<ResultCalcInsMainCvgObj>();
    this.TotalMainPremiAmt = 0;
    this.TotalAdditionalPremiAmt = 0;
    this.TotalFeeAmt = 0;
  }
}
