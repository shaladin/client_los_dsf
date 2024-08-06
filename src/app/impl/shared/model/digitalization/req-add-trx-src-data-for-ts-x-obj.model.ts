import { ThirdPartyTrustsocRsltXObj } from "../third-party-rslt/third-party-trustsoc-rslt-x-obj.model";

export class ReqAddTrxSrcDataForTsXObj {
    TrxNo: string;
    CustType: string;
    IdType: string;
    IdNo: string;
    ThirdPartyTrustsocRsltObjs : Array<ThirdPartyTrustsocRsltXObj>

    constructor() {
        this.ThirdPartyTrustsocRsltObjs = new Array<ThirdPartyTrustsocRsltXObj>();
    }
}