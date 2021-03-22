import { CommonConstant } from "../constant/CommonConstant";
import { AppCustAddrObj } from "./AppCustAddrObj.Model";

export class InputCustomAddrCustCmpltObj{
    AppCustId: number;
    AppCustAddrId: number;
    MrCustTypeCode: string;
    Mode: string;
    IsDetail: boolean;
    ListInputedAddr: Array<AppCustAddrObj>;
    InputedAddr: AppCustAddrObj;
    EditedIndex: number;
    constructor()
    {
        this.AppCustId = 0;
        this.AppCustAddrId = 0;
        this.MrCustTypeCode = CommonConstant.CustTypePersonal;
        this.Mode = "Add";
        this.IsDetail = false;
        this.ListInputedAddr = new Array<AppCustAddrObj>();
        this.InputedAddr = new AppCustAddrObj();
        this.EditedIndex = 0;
    }
}