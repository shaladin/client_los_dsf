import { AppGuarantorObj } from "./AppGuarantorObj.Model";
import { AppGuarantorCompanyObj } from "./AppGuarantorCompanyObj.Model";

export class GuarantorCompanyObj {
    AppGuarantorObj: AppGuarantorObj;
    AppGuarantorCompanyObj: AppGuarantorCompanyObj;
    RowVersion: any;

    constructor() { 
        this.AppGuarantorObj = new AppGuarantorObj(); 
        this.AppGuarantorCompanyObj = new AppGuarantorCompanyObj();
        this.RowVersion = ""; 
    }
}
