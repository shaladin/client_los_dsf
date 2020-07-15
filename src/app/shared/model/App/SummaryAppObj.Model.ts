import { AppCustObj } from "../AppCustObj.Model";
import { AppCustPersonalObj } from "../AppCustPersonalObj.Model";
import { AppCustAddrObj } from "../AppCustAddrObj.Model";
import { AppCustPersonalJobDataObj } from "../AppCustPersonalJobDataObj.Model";
import { AppGuarantorObj } from "../AppGuarantorObj.Model";

export class SummaryAppObj{
    AppCustObj: AppCustObj;
    AppCustPersonalObj: AppCustPersonalObj;
    AppCustAddrLegalObj: AppCustAddrObj;
    AppCustPersonalJobDataObj: AppCustPersonalJobDataObj;
    NegCustTypeName: string;
    SpouseName: string;
    AppGuarantorObjs: Array<AppGuarantorObj>;

    constructor(){
        this.AppCustObj = new AppCustObj();
        this.AppCustPersonalObj = new AppCustPersonalObj();
        this.AppCustAddrLegalObj = new AppCustAddrObj();
        this.AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
        this.AppGuarantorObjs = new Array<AppGuarantorObj>();
    }
}