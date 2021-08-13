import { AgrmntObj } from "app/shared/model/Agrmnt/Agrmnt.Model";
import { PreGoLiveMainObj } from "app/shared/model/PreGoLiveMainObj.Model";
import { AppTCObj } from "app/shared/model/AppTCObj.Model";


export class PreGoLiveObjX {
    TaskListId : number;
    rAgrmntTC : AgrmntObj;
    preGoLiveObj : PreGoLiveMainObj;
    rAppTcObj: AppTCObj[];
    FlagResume : boolean;
    AdditionalInterestPaidBy : string;
    RequestRFAEndDateObj: any;
    RequestRFAGoLiveObj: any;
    IsNeedEndDateApv: boolean;
    IsNeedApv: boolean;
    constructor() {
        this.rAgrmntTC = new AgrmntObj();
        this.preGoLiveObj = new PreGoLiveMainObj();
        this.rAppTcObj = [];
        this.AdditionalInterestPaidBy = null;
        this.FlagResume = false;
        this.IsNeedEndDateApv = false;
        this.IsNeedApv = false;
    }
}
