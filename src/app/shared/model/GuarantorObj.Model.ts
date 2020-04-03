import { AppGuarantorObj } from "./AppGuarantorObj.Model";

export class GuarantorObj {
    AppGuarantorObj: AppGuarantorObj;
    RowVersion: any;

    constructor() { 
        this.AppGuarantorObj = new AppGuarantorObj(); 
        // this.RowVersion = ""; 
    }
}
