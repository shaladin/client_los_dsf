import { InsRateAddCvgRuleObj } from "../../ins-rate-add-cvg-rule-obj.model";

export class ResInsuranceDataInsRateCvgRuleObj{
    RuleSetName : string;
    Result : ResInsRateCvgRuleObj;
    InsRateMainCvgRuleObj : InsRateMainCvgRuleObj;
    InsRateAddCvgRuleObjs : Array<InsRateAddCvgRuleObj>;
    InsRateAddCvgRuleTplObjs : Array<InsRateAddCvgRuleObj>;

    constructor(){
        this.RuleSetName = "";
        this.Result = new ResInsRateCvgRuleObj();
        this.InsRateMainCvgRuleObj = new InsRateMainCvgRuleObj();
        this.InsRateAddCvgRuleObjs = new Array<InsRateAddCvgRuleObj>();
        this.InsRateAddCvgRuleTplObjs = new Array<InsRateAddCvgRuleObj>();
    }
}

export class ResInsRateCvgRuleObj{
    MainCoverageType : Array<string>; 
    MainRateToInsco : Array<number>;
    BaseRatePercentage : Array<number>;
    MainRateToCust : Array<number>;
    AdditionalCoverageType : Array<string>;
    AssetAgeFrom : Array<number>;
    AssetAgeTo : Array<number>;
    PremiumType : Array<string>;
    RateToInsco : Array<number>;
    RateToCust : Array<number>;
    SumInsuredAmt : Array<number>;
    PremiToInsco : Array<number>;
    PremiToCust : Array<number>;
    BaseCalc : Array<string>;
    
    constructor(){
    this.MainCoverageType = Array<string>();
    this.MainRateToInsco = Array<number>();
    this.BaseRatePercentage = Array<number>();
    this.MainRateToCust = Array<number>();
    this.AdditionalCoverageType = Array<string>();
    this.AssetAgeFrom = Array<number>();
    this.AssetAgeTo = Array<number>();
    this.PremiumType = Array<string>();
    this.RateToInsco = Array<number>();
    this.RateToCust = Array<number>();
    this.SumInsuredAmt = Array<number>();
    this.PremiToInsco = Array<number>();
    this.PremiToCust = Array<number>();
    this.BaseCalc = Array<string>();
    }
}

export class InsRateMainCvgRuleObj{
    MainCoverageType : string;
    MainRateToInsco : number;
    BaseRatePercentage : number;
    MainRateToCust : number;
    
    constructor(){
    this.MainCoverageType = "";
    this.MainRateToInsco = 0;
    this.BaseRatePercentage = 0;
    this.MainRateToCust = 0;
    }
}