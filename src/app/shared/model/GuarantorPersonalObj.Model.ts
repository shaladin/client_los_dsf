import { AppGuarantorObj } from "./AppGuarantorObj.Model";
import { AppGuarantorPersonalObj } from "./AppGuarantorPersonalObj.Model";

export class GuarantorPersonalObj {
    AppGuarantorObj: AppGuarantorObj;
    AppGuarantorPersonalObj: AppGuarantorPersonalObj;
    RowVersion: any;

    constructor() { 
        this.AppGuarantorObj = new AppGuarantorObj(); 
        this.AppGuarantorPersonalObj = new AppGuarantorPersonalObj();
        this.RowVersion = ""; 
    }
}
