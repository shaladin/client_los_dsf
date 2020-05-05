import { AppGuarantorObj } from "./AppGuarantorObj.Model";

export class GuarantorObj {
    AppGuarantorId: number;
    AppGuarantorObj: AppGuarantorObj;
    RowVersion: any;

    constructor() { 
        this.AppGuarantorObj = new AppGuarantorObj(); 
        // this.RowVersion = ""; 
    }
}
