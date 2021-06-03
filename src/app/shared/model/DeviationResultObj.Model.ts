export class DeviationResultObj {
    
    DeviationResultId: number;
    SeqNo: number;
    DeviationCategory: string;
    MrDeviationType: string;
    RefNo: string;
    TrxTypeCode: string;
    ApvAt: string;
    OriginalValue: string;
    CurrentValue: string;
    BehaviourValue: string;
    IsFatal: boolean;
    Notes: string;
    RowVersion: string;
    
    constructor() { 
        this.RowVersion = "";
    }
}