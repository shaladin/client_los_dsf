import { CrdRvwDealerBucketObj } from "./CrdRvwDealerBucketObj.Model";

export class CrdRvwDealerObj {

    CrdRvwDealerId: number;
    CrdRvwExposureId: number;
    CooperationDt: Date;
    DealerCode: string;
    DealerName: string;
    Sales: string;
    Spv: string;
    Bm: string;
    SpanOfMonth: number;
    AllAgrmnt: number;
    AllWo: number;
    AllRepo: number;
    AppIncoming: number;
    AppReject: number;
    AppLive: number;
    AgrmntFpd: number;
    AgrmntRepo: number;
    AgrmntWo: number;
    ListCrdRvwDealerBucketObj: Array<CrdRvwDealerBucketObj>
    constructor() {
        this.ListCrdRvwDealerBucketObj = new Array<CrdRvwDealerBucketObj>();
    }
}