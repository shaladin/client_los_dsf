import { CrdRvwCmoBucketObj } from "./CrdRvwCmoBucketObj.Model";

export class CrdRvwCmoObj {

    CrdRvwCmoId: number;
    CrdRvwExposureId: number;
    CmoCode: string;
    CmoName: string;
    SpvName: string;
    JoinDt: Date;
    AgrmntSold: number;
    AgrmntFpd: number;
    AgrmntRepo: number;
    AgrmntWo: number;
    SpanOfMonth: number;
    AllAgrmnt: number;
    AllWo: number;
    AllRepo: number;
    ListCrdRvwCmoBucketObj: Array<CrdRvwCmoBucketObj>;
    constructor() {
        this.ListCrdRvwCmoBucketObj = new Array<CrdRvwCmoBucketObj>();
    }
}