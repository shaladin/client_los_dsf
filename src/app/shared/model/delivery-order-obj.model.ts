import { environment } from "environments/environment";
import { AppAssetObj } from "./app-asset-obj.model";
import { DeliveryOrderHObj } from "./delivery-order-h-obj.model";
import { ListAppCollateralDocObj } from "./list-app-collateral-doc-obj.model";
import { ListAppTCObj } from "./list-app-tc-obj.model";

export class DeliveryOrderObj {
    AppAssetObj: AppAssetObj;
    ListAppCollateralDocObj: ListAppCollateralDocObj;
    DeliveryOrderHObj: DeliveryOrderHObj;
    ListAppTCObj: ListAppTCObj;
    TaskListId : any;
    AgrmntId : number;
    constructor()
    {
        this.AppAssetObj = new AppAssetObj();
        this.ListAppCollateralDocObj = new ListAppCollateralDocObj();
        this.DeliveryOrderHObj = new DeliveryOrderHObj();
        this.ListAppTCObj = new ListAppTCObj();
        this.TaskListId = environment.isCore ? "" : 0;
        this.AgrmntId = 0;
    }
}