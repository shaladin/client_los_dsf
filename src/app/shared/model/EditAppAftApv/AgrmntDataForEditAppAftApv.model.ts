import { AgrmntCommissionHObj } from "../Agrmnt/AgrmntCommissionHObj.model";
import { AppAssetObj } from "../AppAssetObj.model";
import { AppCollateralObj } from "../AppCollateralObj.Model";
import { AppCollateralRegistrationObj } from "../AppCollateralRegistrationObj.Model";
import { PurchaseOrderHObj } from "../PurchaseOrderHObj.Model";

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