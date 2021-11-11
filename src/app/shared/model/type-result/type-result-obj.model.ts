import { ResultAttrObj } from "./result-attr-obj.model";

export class TypeResultObj {
    TypeCode: string;
    Attributes: Array<ResultAttrObj>;

    constructor() {
        this.TypeCode = "";
        this.Attributes = new Array();
    }
}