import { AppGuarantorObj } from "./AppGuarantorObj.Model";

export class GuarantorObj {
    AppId: number;
    AppGuarantorObj: AppGuarantorObj;
    RowVersion: string;

    constructor() { 
        this.AppGuarantorObj = new AppGuarantorObj(); 
        // this.RowVersion = ""; 
    }
}
