import { AppAssetOthExpenseOplObj } from "./AppAssetExpense/AppAssetOthExpenseOplObj.Model";
import { AppAssetRentDataOplObj } from "./AppAssetRentDataOpl.Model";

export class AppAssetFinancialDataObj {
    AppAssetRentDataOplObj: AppAssetRentDataOplObj;
    Tenor: number;
    MrFirstInstTypeCode: string
    MrFirstInstTypeName: string
    TotalAssetPriceAmt: number;
    AssetPriceAmt: number;
    TotalAccessoriesPriceAmt: string;
    PayFreqCode: string;
    PayFreqVal: number;
    MrPayFreqTypeCode: string;
    DiscAmt: number;
    AppAssetOthExpenseOplObjs: Array<AppAssetOthExpenseOplObj>;

    constructor() {
        this.AppAssetRentDataOplObj = new AppAssetRentDataOplObj();
        this.Tenor = 0;
        this.MrFirstInstTypeCode = "";
        this.MrFirstInstTypeName = "";
        this.TotalAssetPriceAmt = 0;
        this.AssetPriceAmt = 0;
        this.TotalAccessoriesPriceAmt = "";
        this.PayFreqCode = "";
        this.PayFreqVal = 0;
        this.MrPayFreqTypeCode = "";
        this.DiscAmt = 0;
        this.AppAssetOthExpenseOplObjs = new Array<AppAssetOthExpenseOplObj>();
    }
}
