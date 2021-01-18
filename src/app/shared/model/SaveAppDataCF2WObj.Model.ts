import { AppCollateralObj } from "./AppCollateralObj.Model";
import { AppAssetObj } from "./AppAssetObj.Model";
import { AppObj } from "./App/App.Model";
import { AppFixedObj } from "./AppFixedObj.Model";

export class SaveAppDataCF2WObj{
    AppObj: AppObj;
    AppAssetObj: AppAssetObj;
    AppCollateralObj: AppCollateralObj;
    AppFixedObj: AppFixedObj;
    AppFixedFeeObj: any;
    AppFixedInsObj: any;
    RowVersion: any;

    constructor() {
        this.AppObj = new AppObj();
        this.AppAssetObj = new AppAssetObj();
        this.AppCollateralObj = new AppCollateralObj();
        this.AppFixedObj = new AppFixedObj();
        this.AppFixedFeeObj = new Array();
        this.AppFixedInsObj = new Array();
        this.RowVersion = ""; 
    }
}