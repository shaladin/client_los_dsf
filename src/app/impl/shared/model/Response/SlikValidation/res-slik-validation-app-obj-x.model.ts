import { ResSlikValidationAppCustObjX } from "./res-slik-validation-app-cust-obj-x.model";

export class ResSlikValidationAppObjX {

    AppId: number;
    IsValid: boolean;
    ListAppCustValidationObj: Array<ResSlikValidationAppCustObjX>;
    
    constructor() {
        this.AppId = 0;
        this.IsValid = true;
        this.ListAppCustValidationObj = [];
    }
}