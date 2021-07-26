export class ChangeMouTrxObj {
    ChangeMouTrxId: number;
    ChangeMouCustId : number;
    MouCustId : number;
    Version : number;
    ChangeMouTrxNo: string;
    RequestDate: Date;
    ExecutionDate: Date;
    RejectDate: Date;
    Status: string;
    TrxType: string;
    Notes: string;
    RefOfficeId : number;
    RowVersion: string;
    constructor(){ this.ChangeMouTrxId = 0; this.RowVersion = ''}
}