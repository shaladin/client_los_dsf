import { AppCustAddrObj } from "./AppCustAddrObj.Model";
import { AppCustPersonalJobDataObj } from "./AppCustPersonalJobDataObj.Model";

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