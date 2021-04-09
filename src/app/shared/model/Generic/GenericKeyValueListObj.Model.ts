import { KeyValueObj } from "../KeyValue/KeyValueObj.Model";

export class GenericKeyValueListObj
{
    ReturnObject : Array<KeyValueObj>;
    
    constructor(){
        this.ReturnObject = new Array<KeyValueObj>();
    }
}  