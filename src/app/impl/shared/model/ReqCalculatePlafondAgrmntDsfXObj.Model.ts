export class ReqCalculatePlafondAgrmntDsfXObj {
    AppId: number;
    AgrmntParentNo: string;
    TotalAssetPrice: number;
    OsArAgrmntMasterAmt: number;
    OsArMpfDtAmt: number;
    OsNiMpfDtAmt: number;
    LobCode: string;
    AssetTypeCode: string;
    EffectiveDt: Date;
    GoLiveDt: Date;
    Tenor: number;
    constructor() {
        this.AppId = 0;
        this.AgrmntParentNo = "";
        this.TotalAssetPrice = 0;
        this.OsArAgrmntMasterAmt = 0;
        this.OsArMpfDtAmt = 0;
        this.OsNiMpfDtAmt = 0;
        this.LobCode = "";
        this.AssetTypeCode = "";
        this.EffectiveDt = new Date();
        this.GoLiveDt = new Date();
        this.Tenor = 0;
        this.TotalAssetPrice = 0;
    }
}  