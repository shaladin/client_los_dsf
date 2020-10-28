import { CommonConstant } from "../constant/CommonConstant";

export class InputCustomAddrCustCmpltObj{
    AppCustId: number;
    MrCustTypeCode: string;
    Mode: string;
    IsDetail: boolean;

    constructor()
    {
        this.AppCustId = 0;
        this.MrCustTypeCode = CommonConstant.CustTypePersonal;
        this.Mode = "Add";
        this.IsDetail = false;
    }
}