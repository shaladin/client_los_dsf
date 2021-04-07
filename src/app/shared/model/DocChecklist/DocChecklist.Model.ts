
import { ListAppTCObj } from "../ListAppTCObj.Model";


export class DocChecklist {
    TaskListId : any;
    RListAppTcObj: ListAppTCObj;

    constructor() {
      this.RListAppTcObj = new ListAppTCObj();
    }
}
