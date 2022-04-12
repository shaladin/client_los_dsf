import { KeyValueObj } from "app/shared/model/key-value/key-value-obj.model";

export class ResSlikValidationAppCustObjX {

    AppCustId: number;
    CustNo: string;
    CustName: string;
    ValidationErrorObj: Array<KeyValueObj>;
    
    constructor() {
        this.AppCustId = 0;
        this.CustNo = "";
        this.CustName = "";
        this.ValidationErrorObj = [];
    }
}