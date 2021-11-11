import { AgrmntObj } from "app/shared/model/Agrmnt/Agrmnt.Model";
import { PreGoLiveMainObj } from "app/shared/model/pre-go-live-main-obj.model";
import { AgrmntTcObj } from "app/shared/model/agrmnt-tc/agrmnt-tc-obj.model";


export class PreGoLiveObjX {
    TaskListId : number;
    rAgrmntTC : AgrmntObj;
    preGoLiveObj : PreGoLiveMainObj;
    ListAgrmntTcObj: Array<AgrmntTcObj>;
    FlagResume : boolean;
    AdditionalInterestPaidBy : string;
    RequestRFAEndDateObj: any;
    RequestRFAGoLiveObj: any;
    IsNeedEndDateApv: boolean;
    IsNeedApv: boolean;
    constructor() {
        this.rAgrmntTC = new AgrmntObj();
        this.preGoLiveObj = new PreGoLiveMainObj();
        this.ListAgrmntTcObj = new Array<AgrmntTcObj>();
        this.AdditionalInterestPaidBy = null;
        this.FlagResume = false;
        this.IsNeedEndDateApv = false;
        this.IsNeedApv = false;
    }
}
