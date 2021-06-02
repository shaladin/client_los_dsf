import { CofPrincipalObj } from "./CofPrincipal.Model";
import { ResultFinancialOplRuleObj } from "./ResultFinancialOplRule.Model";
import { ResultResidualValueRuleObj } from "./ResultResidualValueRule.Model";

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