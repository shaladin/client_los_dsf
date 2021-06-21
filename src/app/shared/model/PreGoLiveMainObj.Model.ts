export class PreGoLiveMainObj {
    PreGoLiveId : number;
    AgrmntId : number;
    AgrmntDt : Date;
    EffectiveDt : Date;
    Notes : string;
    IsNeedApproval : boolean;
    ApprovalStat : string;
    RowVersion : string;
    
    constructor() {
        this.PreGoLiveId = 0;
        this.AgrmntId = 0;
        this.RowVersion = "";
    }
}
