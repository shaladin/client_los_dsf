import { KeyValueObj } from "../KeyValue/KeyValueObj.model";

export class GenericKeyValueListObj
{
    ReturnObject : Array<KeyValueObj>;
    
    constructor(){
        this.ReturnObject = new Array<KeyValueObj>();
    }
}  