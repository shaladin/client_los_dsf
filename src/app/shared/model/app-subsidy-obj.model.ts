import { AppFeeObj } from "./app-fee-obj.model";

export class AppSubsidyObj {
    AppId: number;
    AppSubsidyId: number;
    MrSubsidyFromTypeCode: string;
    MrSubsidyFromTypeName: string;
    MrSubsidyFromValueCode: string;
    MrSubsidyFromValueName: string;
    MrSubsidyAllocCode: string;
    MrSubsidyAllocName: string;
    MrSubsidySourceCode: string;
    MrSubsidySourceName: string;
    MrSubsidyValueTypeCode: string;
    MrSubsidyValueTypeName: string;
    SubsidyPrcnt: number;
    SubsidyAmt: number;
    AppFees : Array<AppFeeObj>
    RowVersion: string;

    constructor() { 
        this.RowVersion = "";
    }
}