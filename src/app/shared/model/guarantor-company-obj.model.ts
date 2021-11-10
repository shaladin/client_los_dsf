import { AppGuarantorObj } from "./app-guarantor-obj.model";
import { AppGuarantorCompanyObj } from "./app-guarantor-company-obj.model";

export class GuarantorCompanyObj {
    AppGuarantorObj: AppGuarantorObj;
    AppGuarantorCompanyObj: AppGuarantorCompanyObj;
    RowVersion: string;

    constructor() { 
        this.AppGuarantorObj = new AppGuarantorObj(); 
        this.AppGuarantorCompanyObj = new AppGuarantorCompanyObj();
        this.RowVersion = ""; 
    }
}
