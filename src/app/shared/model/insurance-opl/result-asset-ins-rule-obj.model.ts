import { MainAssetInsRuleObj } from "./main-asset-ins-rule-obj.model";
import { InsMainCvgObj } from "./ins-main-cvg-obj.model";
import { InsAddCvgObj } from "./ins-add-cvg-obj.model";
import { InsFeeObj } from "./ins-fee-obj.model";

export class ResultAssetInsRuleObj {
  Result: MainAssetInsRuleObj;
  InsRateMainCvgRuleObjs: Array<InsMainCvgObj>;
  InsRateAddCvgRuleObjs: Array<InsAddCvgObj>;
  InsRateFeeRuleObjs: Array<InsFeeObj>;
  constructor() {

  }
}
