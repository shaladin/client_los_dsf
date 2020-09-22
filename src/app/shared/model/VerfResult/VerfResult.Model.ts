export class VerfResultObj {
    VerfResultId: number;
    VerfResultNo: string;
    TrxRefNo: string;
    VerfDt: Date;
    EmpNo: string;
    EmpName: string;
    MrVerfResultStatCode: string;
    MrVerfTrxTypeCode: string;
    LobCode: string;
    LobName: string;
    Notes: string;
    RowVersion: string;

    constructor() {
        this.VerfResultId = 0;
        this.VerfResultNo = "";
        this.TrxRefNo = "";
        this.VerfDt = new Date();
        this.EmpNo = "";
        this.EmpName = "";
        this.MrVerfResultStatCode = "";
        this.MrVerfTrxTypeCode = "";
        this.LobCode = "";
        this.LobName = "";
        this.Notes = "";
        this.RowVersion = "";
    }
}
