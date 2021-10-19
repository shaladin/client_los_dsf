import { AgrmntObj } from "app/shared/model/Agrmnt/Agrmnt.Model";
import { PreGoLiveMainObj } from "app/shared/model/PreGoLiveMainObj.Model";
import { AgrmntTcObj } from "app/shared/model/AgrmntTc/AgrmntTcObj.Model";


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
