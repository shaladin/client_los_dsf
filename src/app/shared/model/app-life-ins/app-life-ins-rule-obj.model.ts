import { DiscRateObj } from "./disc-rate-obj.model";
import { LifeInsFeeObj } from "./life-ins-fee-obj.model";
import { SumInsRateObj } from "./sum-ins-rate-obj.model";
import { ValidationObj } from "./validation-obj.model";

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