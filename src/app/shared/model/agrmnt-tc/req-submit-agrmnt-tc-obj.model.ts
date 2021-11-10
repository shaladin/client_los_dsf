import { AgrmntTcObj } from "./agrmnt-tc-obj.model";

export class ReqSubmitAgrmntTcObj{
    AgrmntId: number;
    ListAgrmntTcObj: Array<AgrmntTcObj>

    constructor() {
        this.ListAgrmntTcObj = new Array<AgrmntTcObj>();
    }
}