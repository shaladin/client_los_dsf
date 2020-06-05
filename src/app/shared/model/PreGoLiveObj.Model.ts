import { AgrmntObj } from "./Agrmnt/Agrmnt.Model";
import { PreGoLiveMainObj } from "./PreGoLiveMainObj.Model";
import { ListAppTCObj } from "./ListAppTCObj.Model";
import { AppTCObj } from "./AppTCObj.Model";

export class PreGoLiveObj {
    TaskListId : any;
    rAgrmntTC : AgrmntObj;
    preGoLiveObj : PreGoLiveMainObj;
    rAppTcObj: AppTCObj[];
    FlagResume : boolean;

    constructor() {
        this.rAgrmntTC = new AgrmntObj();
        this.preGoLiveObj = new PreGoLiveMainObj();
        this.rAppTcObj = [];
        this.FlagResume = false;
    }
}
