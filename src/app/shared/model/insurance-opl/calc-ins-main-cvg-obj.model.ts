import { CalcInsAddCvgObj } from "./calc-ins-add-cvg-obj.model";

export class CalcInsMainCvgObj {
    YearNo: number;
    Month: number;
    CoverageAmt: number;
    SumInsured: number;
    Rate: number;
    MainCoverageTypeCode: string;
    RateToInsco: number;
    AddInsCoverage: Array<CalcInsAddCvgObj>;
constructor() {
    this.AddInsCoverage = new Array<CalcInsAddCvgObj>();
    }
}
