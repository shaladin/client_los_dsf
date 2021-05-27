export class GenericObj {
    Id: number;
    Code: string;
    Codes: string[];
    TrxNo: string;
    EmpNo: string;
    CustNo: string;
    RowVersion: string;
    constructor() {
        this.Codes = new Array();
    }
}