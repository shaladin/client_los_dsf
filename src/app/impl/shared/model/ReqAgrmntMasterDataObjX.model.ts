export class ReqAgrmntMasterDataObjX {
    AppId: number;
    AppNo: string;
    AgrmntParentNo: string;
    TotalAgrmntMpfDt: number;
    PlafondAgrmntAmt: number;
    MaxPlafondAgrmntAmt: number;
    MaxTenor: number;
    RowVersion: string;
  
    constructor() {
      this.AppId = 0;
      this.AppNo = "";
      this.AgrmntParentNo = "";
      this.TotalAgrmntMpfDt = 0;
      this.PlafondAgrmntAmt = 0;
      this.MaxPlafondAgrmntAmt = 0;
      this.MaxTenor = 0;
      this.RowVersion = "";
    }
  }
  