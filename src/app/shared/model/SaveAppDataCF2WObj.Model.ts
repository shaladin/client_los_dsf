import { AppCollateralObj } from "./AppCollateralObj.Model";
import { AppAssetObj } from "./AppAssetObj.Model";
import { AppObj } from "./App/App.Model";
import { AppFixedObj } from "./AppFixedObj.Model";
import { AppFixedFeeObj } from "./AppFixedFeeObj.Model";
import { AppFixedInsObj } from "./AppFixedInsObj.Model";

export class SaveAppDataCF2WObj{
    AppObj: AppObj;
    AppAssetObj: AppAssetObj;
    AppCollateralObj: AppCollateralObj;
    AppFixedObj: AppFixedObj;
    AppFixedFeeObj: Array<AppFixedFeeObj>;
    AppFixedInsObj: Array<AppFixedInsObj>;
    RowVersion: string;

    constructor() {
        this.AppObj = new AppObj();
        this.AppAssetObj = new AppAssetObj();
        this.AppCollateralObj = new AppCollateralObj();
        this.AppFixedObj = new AppFixedObj();
        this.AppFixedFeeObj = new Array<AppFixedFeeObj>();
        this.AppFixedInsObj = new Array<AppFixedInsObj>();
        this.RowVersion = ""; 
    }
}