import { AppAssetObj } from "./AppAssetObj.Model";
import { DeliveryOrderHObj } from "./DeliveryOrderHObj.Model";
import { ListAppCollateralDocObj } from "./ListAppCollateralDocObj.Model";
import { ListAppTCObj } from "./ListAppTCObj.Model";

export class DeliveryOrderObj {
    AppAssetObj: AppAssetObj;
    ListAppCollateralDocObj: ListAppCollateralDocObj;
    DeliveryOrderHObj: DeliveryOrderHObj;
    ListAppTCObj: ListAppTCObj;
    TaskListId : any;
    constructor()
    {
        this.AppAssetObj = new AppAssetObj();
        this.ListAppCollateralDocObj = new ListAppCollateralDocObj();
        this.DeliveryOrderHObj = new DeliveryOrderHObj();
        this.ListAppTCObj = new ListAppTCObj();
    }
}