import { ReqAppCollateralForCopyInsuranceCustomObj } from "../AppCollateral/ReqCollateralForCopyInsuranceObj.model";

export class ReqCopyInsuranceCustomObj {
    ReqInsuranceForCopyInsuranceCustomObj: ReqInsuranceForCopyInsuranceCustomObj;
    ReqAppCollateralForCopyInsuranceCustomObj: ReqAppCollateralForCopyInsuranceCustomObj;

    constructor() {
        this.ReqInsuranceForCopyInsuranceCustomObj = new ReqInsuranceForCopyInsuranceCustomObj();
        this.ReqAppCollateralForCopyInsuranceCustomObj = new ReqAppCollateralForCopyInsuranceCustomObj()
    }
}

export class ReqInsuranceForCopyInsuranceCustomObj {
    InscoBranchCode: string;
    InsLength: number;
    InsAssetPaidBy: string;
    InsAssetCoveredBy: string;
    TotalInsCustAmt: number;

    constructor() {
        this.InscoBranchCode = "";
        this.InsLength = 0;
        this.InsAssetPaidBy = "";
        this.InsAssetCoveredBy = "";
        this.TotalInsCustAmt = 0; 
    }
}