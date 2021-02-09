import { CalcInsMainCvgObj } from "./CalcInsMainCvgObj.Model";
import { CalcInsAddCvgObj } from "./CalcInsAddCvgObj.Model";

export class RequestCalcInsObj {
    InsCoverage: Array<CalcInsMainCvgObj>;
    StampDutyFee: number;
    AdminFee: number;
    InscoBranchCode: string;
    ProdOfferingCode: string;
    ProdOfferingVersion: string;
    AppAssetId: number;
  AppCollateralId: number;
  ListFee: Array<number>

constructor() {
    this.InsCoverage = new Array<CalcInsMainCvgObj>();
    this.StampDutyFee = 0;
    this.AdminFee = 0;
    this.InscoBranchCode = "";
    }
}
