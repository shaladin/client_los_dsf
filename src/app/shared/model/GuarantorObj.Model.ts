import { AppGuarantorObj } from "./AppGuarantorObj.Model";

export class GuarantorObj {
    AppId: number;
    AppGuarantorObj: AppGuarantorObj;
    RowVersion: any;

    constructor() { 
        this.AppGuarantorObj = new AppGuarantorObj(); 
        // this.RowVersion = ""; 
    }
}
