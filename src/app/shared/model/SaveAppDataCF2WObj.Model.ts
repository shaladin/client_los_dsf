import { AppCollateralObj } from "./AppCollateralObj.Model";
import { AppAssetObj } from "./AppAssetObj.model";
import { AppObj } from "./App/App.Model";

export class SaveAppDataCF2WObj{
    AppObj: AppObj;
    AppAssetObj: AppAssetObj;
    AppCollateralObj: AppCollateralObj;
    RowVersion: any;

    constructor() {
        this.AppObj = new AppObj();
        this.AppAssetObj = new AppAssetObj();
        this.AppCollateralObj = new AppCollateralObj(); 
        this.RowVersion = ""; 
    }
}