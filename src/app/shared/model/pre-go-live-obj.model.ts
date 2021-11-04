import { AgrmntObj } from "./agrmnts/agrmnts.model";
import { PreGoLiveMainObj } from "./pre-go-live-main-obj.model";
import { ListAppTCObj } from "./list-app-tc-obj.model";
import { AppTCObj } from "./app-tc-obj.model";
import { AgrmntTcObj } from "./agrmnt-tc/agrmnt-tc-obj.model";

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
