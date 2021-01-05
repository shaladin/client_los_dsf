export class AppTCObj{
    AppTcId: number;
    AppId: number;
    TcName : string;
    TcCode: string;
    PriorTo: any;
    IsChecked: boolean;
    IsMandatory: boolean;
    PromisedDt: any;
    CheckedDt: any;
    Notes: string;
    ExpiredDt: any;
    IsAdditional: boolean;
    IsExpDtMandatory: boolean;
    IsWaivable: boolean;
    IsWaived: boolean;
    RowVersion: any;
    constructor() { 
        this.RowVersion = "";
    }
}