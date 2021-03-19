import { NewCustAttrContentObj } from "./NewCustAttrContentObj.Model";

export class ResponseListCustAttrContentObj {
    NewCustAttrContentObjs: Array<NewCustAttrContentObj>;
constructor() { 
        this.NewCustAttrContentObjs = new Array<NewCustAttrContentObj>();
    }
}
