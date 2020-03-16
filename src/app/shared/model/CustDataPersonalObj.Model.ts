import { AppCustObj } from "./AppCustObj.Model";
import { AppCustPersonalObj } from "./AppCustPersonalObj.Model";

export class CustDataPersonalObj {
    AppCustObj: AppCustObj;
    AppCustPersonalObj: AppCustPersonalObj;
    RowVersion: any;

    constructor() { 
        this.AppCustObj = new AppCustObj(); 
        this.AppCustPersonalObj = new AppCustPersonalObj();
        this.RowVersion = ""; 
    }
}
