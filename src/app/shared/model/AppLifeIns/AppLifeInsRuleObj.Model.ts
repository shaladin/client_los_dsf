import { DiscRateObj } from "./DiscRateObj.Model";
import { LifeInsFeeObj } from "./LifeInsFeeObj.Model";
import { SumInsRateObj } from "./SumInsRateObj.Model";
import { ValidationObj } from "./ValidationObj.Model";

export class AppLifeInsRuleObj{
    ResultLifeInsFeeObj: LifeInsFeeObj;
    SumInsRateObjs: Array<SumInsRateObj>;
    DiscRateObjs: Array<DiscRateObj>;
    ValidationObjs: Array<ValidationObj>;

    constructor(){
        this.ResultLifeInsFeeObj = new LifeInsFeeObj();
        this.SumInsRateObjs = new Array<SumInsRateObj>();
        this.DiscRateObjs = new Array<DiscRateObj>();
        this.ValidationObjs = new Array<ValidationObj>();
    }
}