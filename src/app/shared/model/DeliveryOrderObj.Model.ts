import { environment } from "environments/environment";
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