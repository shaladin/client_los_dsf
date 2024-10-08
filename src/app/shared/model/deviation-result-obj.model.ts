export class DeviationResultObj {
    
    DeviationResultId: number;
    SeqNo: number;
    DeviationCategory: string;
    MrDeviationType: string;
    MrDeviationName: string;
    RefNo: string;
    TrxTypeCode: string;
    ApvAt: string;
    OriginalValue: string;
    CurrentValue: string;
    BehaviourValue: string;
    IsFatal: boolean;
    Notes: string;
    RowVersion: string;
    IsOriginalValueNumber: boolean = false;
    IsCurrentValueNumber: boolean = false;
    
    constructor() { 
        this.RowVersion = "";
    }
}