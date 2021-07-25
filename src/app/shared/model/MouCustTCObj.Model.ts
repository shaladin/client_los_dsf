export class MouCustTCObj {
    MouCustTcId: number;
    MouCustId: number;
    TcCode: string;
    TcName: string;
    IsChecked: boolean;
    IsMandatory: boolean;
    PromisedDt: boolean;
    CheckedDt: Date;
    ExpiredDt: Date;
    Notes: string;
    IsFromRule: boolean;
    PriorTo: string;
    RowVersion: string;
    constructor(){ this.MouCustTcId = 0; this.RowVersion = "" }
}