import { ResultAttrObj } from "./ResultAttrObj.Model";

export class TypeResultObj {
    TypeCode: string;
    Attributes: Array<ResultAttrObj>;

    constructor() {
        this.TypeCode = "";
        this.Attributes = new Array();
    }
}