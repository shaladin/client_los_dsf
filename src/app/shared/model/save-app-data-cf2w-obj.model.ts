import { AppCollateralObj } from "./app-collateral-obj.model";
import { AppAssetObj } from "./app-asset-obj.model";
import { AppObj } from "./app/app.model";
import { AppFixedObj } from "./app-fixed-obj.model";
import { AppFixedFeeObj } from "./app-fixed-fee-obj.model";
import { AppFixedInsObj } from "./app-fixed-ins-obj.model";

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