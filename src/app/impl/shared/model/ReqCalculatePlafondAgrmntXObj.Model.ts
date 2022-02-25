export class ReqCalculatePlafondAgrmntXObj {
    AppId: number;
    AgrmntParentNo: string  ;
    TotalAssetPrice: number;
    OsArAgrmntMasterAmt: number;
    OsArMpfDtAmt : number;
    LobCode: string;
    AssetTypeCode: string;
    EffectiveDt: Date;
    GoLiveDt: Date;
    constructor()
    {
        this.AppId = 0;
        this.AgrmntParentNo = "";
        this.TotalAssetPrice = 0;
        this.OsArAgrmntMasterAmt = 0;
        this.OsArMpfDtAmt = 0;
        this.LobCode = "";
        this.AssetTypeCode = "";
        this.EffectiveDt = new Date();
        this.GoLiveDt = new Date();
    }
}  