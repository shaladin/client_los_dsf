import { CrdRvwExposureDObj } from "./crd-rvw-exposure-d-obj.model";

export class CrdRvwExposureHObj{
    
    CrdRvwExposureHId: number;
    CustNo: string;
    CrdRvwCustInfoId: number;
    CustName: string;
    CustIndicator: string;
    CustIndicatorDescr: string;
    IdType: string;
    IdNo: string;
    RelationWithCust: string;
    RelationType: string;
    ListCrdRvwExposureDObj: Array<CrdRvwExposureDObj> = new Array<CrdRvwExposureDObj>();
    constructor(){}
}