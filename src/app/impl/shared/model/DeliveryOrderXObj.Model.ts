import { environment } from "environments/environment";
import { AppAssetObj } from "app/shared/model/app-asset-obj.model";
import { ListAppCollateralDocObj } from "app/shared/model/list-app-collateral-doc-obj.model";
import { DeliveryOrderHObj } from "app/shared/model/delivery-order-h-obj.model";
import { ListAppTCObj } from "app/shared/model/list-app-tc-obj.model";

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