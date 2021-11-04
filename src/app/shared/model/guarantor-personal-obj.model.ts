import { AppGuarantorObj } from "./app-guarantor-obj.model";
import { AppGuarantorPersonalObj } from "./app-guarantor-personal-obj.model";

export class GuarantorPersonalObj {
    AppGuarantorObj: AppGuarantorObj;
    AppGuarantorPersonalObj: AppGuarantorPersonalObj;
    RowVersion: string;

    constructor() { 
        this.AppGuarantorObj = new AppGuarantorObj(); 
        this.AppGuarantorPersonalObj = new AppGuarantorPersonalObj();
        this.RowVersion = ""; 
    }
}
