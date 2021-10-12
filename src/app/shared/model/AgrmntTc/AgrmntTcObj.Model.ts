export class AgrmntTcObj{
    AgrmntTcId: number;
    AgrmntId: number;
    TcName : string;
    TcCode: string;
    PriorTo: string;
    IsChecked: boolean;
    IsMandatory: boolean;
    PromisedDt: Date;
    CheckedDt: Date;
    Notes: string;
    ExpiredDt: Date;
    IsAdditional: boolean;
    IsExpDtMandatory: boolean;
    IsWaivable: boolean;
    IsWaived: boolean;
    constructor() { 
    }
}