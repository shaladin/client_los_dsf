
import { ListAppTCObj } from "../list-app-tc-obj.model";


export class DocChecklist {
    TaskListId : number;
    RListAppTcObj: ListAppTCObj;

    constructor() {
      this.RListAppTcObj = new ListAppTCObj();
    }
}
