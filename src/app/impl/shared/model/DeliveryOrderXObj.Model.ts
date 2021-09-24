import { AppAssetObj } from "app/shared/model/AppAssetObj.Model";
import { ListAppCollateralDocObj } from "app/shared/model/ListAppCollateralDocObj.Model";
import { DeliveryOrderHObj } from "app/shared/model/DeliveryOrderHObj.Model";
import { ListAppTCObj } from "app/shared/model/ListAppTCObj.Model";
import { environment } from "environments/environment";

export class DeliveryOrderXObj {
    AppAssetObj: AppAssetObj;
    ListAppCollateralDocObj: ListAppCollateralDocObj;
    DeliveryOrderHObj: DeliveryOrderHObj;
    ListAppTCObj: ListAppTCObj;
    TaskListId : any;
    AgrmntId : number;
    AgrmntCreatedDt: any;
    EffectiveDt: any;
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