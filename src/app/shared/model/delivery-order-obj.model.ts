import { environment } from "environments/environment";
import { AgrmntTcObj } from "./agrmnt-tc/agrmnt-tc-obj.model";
import { ReqAppAssetAttrObj } from "./app-asset-attr-obj.model";
import { AppAssetObj } from "./app-asset-obj.model";
import { ReqAppCollateralAttrObj } from "./app-collateral-attr-obj.model";
import { AppCollateralDocObj } from "./app-collateral-doc-obj.model";
import { AppCollateralRegistrationObj } from "./app-collateral-registration-obj.model";
import { DeliveryOrderHObj } from "./delivery-order-h-obj.model";
import { ListAppCollateralDocObj } from "./list-app-collateral-doc-obj.model";
import { ListAppTCObj } from "./list-app-tc-obj.model";

export class DeliveryOrderObj {
    AppAssetObj: AppAssetObj;
    AppAssetAttrObj: Array<ReqAppAssetAttrObj>;
    AppCollateralRegistrationObj: AppCollateralRegistrationObj;
    AppCollateralAttrObj: Array<ReqAppCollateralAttrObj>;
    AppCollateralDocObj: Array<AppCollateralDocObj>;
    DeliveryOrderHObj: DeliveryOrderHObj;
    ListAgrmntTcObj: Array<AgrmntTcObj>;
    ListAppTCObj: ListAppTCObj;
    TaskListId : any;
    AgrmntId : number;
    constructor()
    {
        this.AppAssetObj = new AppAssetObj();
        this.AppCollateralDocObj = new Array<AppCollateralDocObj>();
        this.DeliveryOrderHObj = new DeliveryOrderHObj();
        this.ListAppTCObj = new ListAppTCObj();
        this.TaskListId = environment.isCore ? "" : 0;
        this.AgrmntId = 0;
        this.ListAgrmntTcObj = new Array<AgrmntTcObj>();
        this.AppAssetAttrObj = new Array<ReqAppAssetAttrObj>();
        this.AppCollateralAttrObj = new Array<ReqAppCollateralAttrObj>();
        this.AppCollateralRegistrationObj = new AppCollateralRegistrationObj();
    }
}