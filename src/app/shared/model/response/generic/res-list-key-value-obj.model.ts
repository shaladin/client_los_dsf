import { KeyValueObj } from "../../key-value/key-value-obj.model";

export class ResListKeyValueObj{
    ReturnObject : Array<KeyValueObj>;
    
    constructor(){
        this.ReturnObject = new Array<KeyValueObj>();
    }
}