import { CofPrincipalObj } from "./cof-principal.model";
import { ResultFinancialOplRuleObj } from "./result-financial-opl-rule.model";
import { ResultResidualValueRuleObj } from "./result-residual-value-rule.model";

export class ResAssetFinancialRuleObj {
    ResultResidualValueRule: ResultResidualValueRuleObj;
    ResultFinancialOplRule: ResultFinancialOplRuleObj;
    CofPrincipalObj: CofPrincipalObj;

    constructor() {
        this.ResultResidualValueRule = new ResultResidualValueRuleObj();
        this.ResultFinancialOplRule = new ResultFinancialOplRuleObj();
        this.CofPrincipalObj = new CofPrincipalObj();
    }
}