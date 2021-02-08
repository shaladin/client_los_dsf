import { MainAssetInsRuleObj } from "./MainAssetInsRuleObj.Model";
import { InsMainCvgObj } from "./InsMainCvgObj.Model";
import { InsAddCvgObj } from "./InsAddCvgObj.Model";
import { InsFeeObj } from "./InsFeeObj.Model";

export class ResultAssetInsRuleObj {
  Result: MainAssetInsRuleObj;
  InsRateMainCvgRuleObjs: Array<InsMainCvgObj>;
  InsRateAddCvgRuleObjs: Array<InsAddCvgObj>;
  InsRateFeeRuleObjs: Array<InsFeeObj>;
  constructor() {

  }
}
