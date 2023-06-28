
import { InsuranceDataObj } from "app/shared/model/insurance-data-obj.model";

export class InsuranceDataXObj {
    AppAssetId: number;
    AppAssetCategoryCode: string;
    InsuranceDataObj : InsuranceDataObj;

    constructor() {
        this.AppAssetId = 0;
        this.AppAssetCategoryCode = "";      
    }
}
