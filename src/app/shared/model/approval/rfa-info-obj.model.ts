import { KeyValueObj } from "../key-value/key-value-obj.model";

export class RFAInfoObj {
    ApprovedById: number;
    OfficeCode: string;
    Value: string;
    Reason: string;
    Notes: string;
    RequestBy: string;
    TrxNo: string;
    RequestDate: Date;
    SchemeName: string;
    SchemeCode: string;
    CategoryName: string;
    CategoryCode: string;
    MinimumFinalLevel: any;
    RecommendationObj: Array<KeyValueObj>

    constructor() {
        this.RecommendationObj = new Array<KeyValueObj>();
    }
}
