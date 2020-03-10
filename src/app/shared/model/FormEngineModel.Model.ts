import { CriteriaObj } from "./CriteriaObj.model";

export class FormEngineModel{
    Module:string;
    KeyValue:Array<Object>;
    TableName:string;
    Where:CriteriaObj[];

    constructor()
    {
    }
}