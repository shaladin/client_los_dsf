import { CalcInsMainCvgObj } from "./CalcInsMainCvgObj.Model";
import { CalcInsAddCvgObj } from "./CalcInsAddCvgObj.Model";

export class InsuranceDataCalcInsObj {
    InsCoverage: Array<CalcInsMainCvgObj>;
    RowVersion: string;

constructor() {
    this.InsCoverage = new Array<CalcInsMainCvgObj>();
    this.RowVersion = "";
    }
}
