export class ReqGetVerfResultObj {
    TrxRefNo: string;
    MrVerfTrxTypeCode: string;
    constructor() {
        this.TrxRefNo = "";
        this.MrVerfTrxTypeCode = "";
    }
}

export class ReqGetVerfResult2Obj extends ReqGetVerfResultObj {
    MrVerfObjCode: string;
    constructor() {
        super();
        this.MrVerfObjCode = "";
    }
}

export class ReqGetVerfResult3Obj {
    VerfResultId: number;
    MrVerfSubjectRelationCode: string;
    constructor() {
        this.VerfResultId = 0;
        this.MrVerfSubjectRelationCode = "";
    }
}

export class ReqGetVerfResult4Obj {
    VerfResultId: number;
    MrVerfObjectCode: string;
    constructor() {
        this.VerfResultId = 0;
        this.MrVerfObjectCode = "";
    }
}