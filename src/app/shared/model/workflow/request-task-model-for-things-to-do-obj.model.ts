import { RequestTaskModelObj } from "./v2/request-task-model-obj.model";

export class RequestTaskModelForThingsToDoObj {
    RequestTaskModel: RequestTaskModelObj;
    UserName: string;
 
    constructor() {
        this.RequestTaskModel = new RequestTaskModelObj();
        this.UserName = "";
    }

}