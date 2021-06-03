export class ResMouCustTCObj {
    MouCustTcId: number;
    MouCustId: number;
    TcCode: string;
    TcName: string;
    IsChecked: boolean;
    IsMandatory: boolean;
    PromisedDt: Date;
    CheckedDt: Date;
    ExpiredDt: Date;
    Notes: string;
    PriorTo: string;
    IsExpiredDt: boolean;
    IsWaivable: boolean;
    IsWaived: boolean;
    RowVersion: any;

    constructor(){ this.MouCustTcId = 0; this.RowVersion = "" }
}