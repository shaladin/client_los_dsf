import { ResultCalcInsAddCvgObj } from "./ResultCalcInsAddCvgObj.Model";

export class ResultCalcInsMainCvgObj {
  YearNo: number;
  CoverageAmt: number;
  SumInsured: number;
  SumInsuredAmt: number;
  Rate: number;
  RateToInsco: number;
  MainCoverageTypeCode: string;
  MainPremiAmt: number;
  MainPremiToInscoAmt: number;
  AdditionalPremiAmt: number;
  AdditionalPremiToInscoAmt: number;
  AddInsCoverage: Array<ResultCalcInsAddCvgObj>;
  constructor() {
    this.AddInsCoverage = new Array<ResultCalcInsAddCvgObj>();
  }
}
