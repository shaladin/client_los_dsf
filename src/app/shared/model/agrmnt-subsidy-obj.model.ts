import { AgrmntFeeObj } from "./agrmnt-fee-obj.model";

export class AgrmntSubsidyObj {
    AgrmntId: number;
    AgrmntSubsidyId: number;
    MrSubdFromTypeCode: string;
    MrSubdFromValueCode: string;
    MrSubdAllocCode: string;
    MrSubdSourceCode: string;
    SubsidyAmt: number;
    AgrmntFees : Array<AgrmntFeeObj>

    constructor() { }
}