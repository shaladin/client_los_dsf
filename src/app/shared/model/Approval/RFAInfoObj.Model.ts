import { KeyValueObj } from "../KeyValue/KeyValueObj.Model";

export class RFAInfoObj {
    ApprovedById: any;
    OfficeCode: any;
    Value: any;
    Reason: any;
    Notes: any;
    RequestBy: any;
    TrxNo: any;
    RequestDate: any;
    SchemeName: any;
    SchemeCode: any;
    CategoryName: any;
    CategoryCode: any;
    MinimumFinalLevel: any;
    RecommendationObj: Array<KeyValueObj>

    constructor() {
        this.RecommendationObj = new Array<KeyValueObj>();
    }
}
