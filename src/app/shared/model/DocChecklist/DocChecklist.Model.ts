
import { ListAppTCObj } from "../ListAppTCObj.Model";


export class DocChecklist {
    TaskListId : number;
    RListAppTcObj: ListAppTCObj;

    constructor() {
      this.RListAppTcObj = new ListAppTCObj();
    }
}
