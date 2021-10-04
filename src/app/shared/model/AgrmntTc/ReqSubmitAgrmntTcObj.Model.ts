import { AgrmntTcObj } from "./AgrmntTcObj.Model";

export class ReqSubmitAgrmntTcObj{
    AgrmntId: number;
    ListAgrmntTcObj: Array<AgrmntTcObj>

    constructor() {
        this.ListAgrmntTcObj = new Array<AgrmntTcObj>();
    }
}