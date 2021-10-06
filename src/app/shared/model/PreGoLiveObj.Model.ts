import { AgrmntObj } from "./Agrmnt/Agrmnt.Model";
import { PreGoLiveMainObj } from "./PreGoLiveMainObj.Model";
import { ListAppTCObj } from "./ListAppTCObj.Model";
import { AppTCObj } from "./AppTCObj.Model";
import { AgrmntTcObj } from "./AgrmntTc/AgrmntTcObj.Model";

export class PreGoLiveObj {
    TaskListId : number;
    rAgrmntTC : AgrmntObj;
    preGoLiveObj : PreGoLiveMainObj;
    ListAgrmntTcObj: Array<AgrmntTcObj>;
    FlagResume : boolean;
    AdditionalInterestPaidBy : string;

    constructor() {
        this.rAgrmntTC = new AgrmntObj();
        this.preGoLiveObj = new PreGoLiveMainObj();
        this.ListAgrmntTcObj = new Array<AgrmntTcObj>();
        this.AdditionalInterestPaidBy = null;
        this.FlagResume = false;
    }
}
