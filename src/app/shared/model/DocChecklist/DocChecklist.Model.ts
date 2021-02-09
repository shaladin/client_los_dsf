
import { ListAppTCObj } from "../ListAppTCObj.Model";


export class DocChecklist {
    TaskListId : any;
    rAppTcObj: ListAppTCObj;

    constructor() {
      this.rAppTcObj = new ListAppTCObj();
    }
}
