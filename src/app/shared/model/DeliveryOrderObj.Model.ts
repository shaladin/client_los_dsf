import { AppAssetObj } from "./AppAssetObj.Model";
import { DeliveryOrderHObj } from "./DeliveryOrderHObj.Model";
import { ListAppCollateralDocObj } from "./ListAppCollateralDocObj.Model";

export class DeliveryOrderObj {
    AppAssetObj: AppAssetObj;
    ListAppCollateralDocObj: ListAppCollateralDocObj;
    DeliveryOrderHObj: DeliveryOrderHObj;

    constructor()
    {
        this.AppAssetObj = new AppAssetObj();
        this.ListAppCollateralDocObj = new ListAppCollateralDocObj();
        this.DeliveryOrderHObj = new DeliveryOrderHObj();
    }
}