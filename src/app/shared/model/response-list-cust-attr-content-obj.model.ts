import { NewCustAttrContentObj } from "./new-cust-attr-content-obj.model";

export class ResponseListCustAttrContentObj {
    NewCustAttrContentObjs: Array<NewCustAttrContentObj>;
constructor() { 
        this.NewCustAttrContentObjs = new Array<NewCustAttrContentObj>();
    }
}
