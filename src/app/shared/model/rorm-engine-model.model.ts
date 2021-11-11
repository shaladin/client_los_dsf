import { CriteriaObj } from "./criteria-obj.model";

export class FormEngineModel{
    Module:string;
    KeyValue:Array<Object>;
    TableName:string;
    Where:CriteriaObj[];

    constructor()
    {
    }
}