import { AppGuarantorObj } from "./app-guarantor-obj.model";

export class GuarantorObj {
    AppId: number;
    AppGuarantorObj: AppGuarantorObj;
    RowVersion: string;

    constructor() { 
        this.AppGuarantorObj = new AppGuarantorObj(); 
        // this.RowVersion = ""; 
    }
}
