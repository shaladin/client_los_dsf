export class NapAppCrossObj {

    AppCrossId: number;
    AppId: number;
    CrossAgrmntNo: string;
    CrossAppNo: string;
    CustName: string;
    MaturityDt: Date;
    ContractStat: string;
    RowVersion: string;

    constructor() {
        this.AppCrossId = 0;
        this.RowVersion = "";
    }
}