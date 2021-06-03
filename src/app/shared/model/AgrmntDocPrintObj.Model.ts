export class AgrmntDocPrintObj {
    AgrmntDocPrintId: number;
    AgrmntId: number;
    AgrmntDocId: number;
    DocPrintDt: Date;
    DocPrintByEmpNo: string;
    PrintSeqNo: number;
    RowVersion: string;
    constructor() { this.AgrmntDocPrintId = 0; this.RowVersion = "" }
}