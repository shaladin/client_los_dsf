import { AgrmntCommissionHObj } from "../agrmnt/agrmnt-commission-h-obj.model";
import { AppAssetObj } from "../app-asset-obj.model";
import { AppCollateralObj } from "../app-collateral-obj.model";
import { AppCollateralRegistrationObj } from "../app-collateral-registration-obj.model";
import { PurchaseOrderHObj } from "../purchase-order-h-obj.model";

export class AgrmntDataForEditAppAftApv {

    AppAssetObjs: Array<AppAssetObj>;
    //AppAssetAttrObj: Array<AppAssetAttrCustomObj>;
    AppCollateralObjs: Array<AppCollateralObj>;
    AppCollateralRegistrationObjs: Array<AppCollateralRegistrationObj>;
    //AppCollateralAttrObjs: Array<AppCollateralAttrObj>;
    PurchaseOrderHObjs: Array<PurchaseOrderHObj>;
    AgrmntCommissionHSupplObjs: Array<AgrmntCommissionHObj>;
    AgrmntCommissionHSupplEmpObjs: Array<AgrmntCommissionHObj>;
    AgrmntCommissionHReferantorObjs: Array<AgrmntCommissionHObj>;
    constructor() {

    }

}