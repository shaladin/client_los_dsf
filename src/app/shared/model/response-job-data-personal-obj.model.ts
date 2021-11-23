import { AppCustAddrObj } from "./app-cust-addr-obj.model";
import { AppCustPersonalJobDataObj } from "./app-cust-personal-job-data-obj.model";

export class ResponseJobDataPersonalObj {
    AppCustPersonalJobDataObj: AppCustPersonalJobDataObj;
    JobAddr: AppCustAddrObj;
    PrevJobAddr: AppCustAddrObj;
    OthBizAddr: AppCustAddrObj;

    constructor()
    {
        this.AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
        this.JobAddr = new AppCustAddrObj()
        this.PrevJobAddr = new AppCustAddrObj()
        this.OthBizAddr = new AppCustAddrObj()
    }
}