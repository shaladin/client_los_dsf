import { KeyValueObj } from "../../KeyValue/KeyValueObj.model";

export class ResListKeyValueObj{
    ReturnObject : Array<KeyValueObj>;
    
    constructor(){
        this.ReturnObject = new Array<KeyValueObj>();
    }
}