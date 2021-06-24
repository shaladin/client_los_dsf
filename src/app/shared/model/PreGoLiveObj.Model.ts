import { AgrmntObj } from "./Agrmnt/Agrmnt.Model";
import { PreGoLiveMainObj } from "./PreGoLiveMainObj.Model";
import { ListAppTCObj } from "./ListAppTCObj.Model";
import { AppTCObj } from "./AppTCObj.Model";

export class PreGoLiveObj {
    TaskListId : number;
    rAgrmntTC : AgrmntObj;
    preGoLiveObj : PreGoLiveMainObj;
    rAppTcObj: AppTCObj[];
    FlagResume : boolean;
    AdditionalInterestPaidBy : string;

    constructor() {
        this.rAgrmntTC = new AgrmntObj();
        this.preGoLiveObj = new PreGoLiveMainObj();
        this.rAppTcObj = [];
        this.AdditionalInterestPaidBy = null;
        this.FlagResume = false;
    }
}
