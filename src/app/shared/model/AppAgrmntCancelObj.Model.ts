export class AppAgrmntCancelObj {
    AppAgrmntCancelId: number;
    AppId: number;
    AgrmntId: number;
    CancelByRefNo: string;
    CancelDt: Date;
    ReasonCode: string;
    CancelNotes: string;
    RowVersion: string;
    IsContractSigned: boolean;
    constructor() {
      this.AppAgrmntCancelId = 0;
      this.RowVersion = "";
      this.IsContractSigned = false;
    }
  }
