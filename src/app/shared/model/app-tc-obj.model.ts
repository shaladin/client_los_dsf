export class AppTCObj{
    AppTcId: number;
    AppId: number;
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
    RowVersion: string;
    constructor() { 
        this.RowVersion = "";
    }
}