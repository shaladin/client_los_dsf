import { CommonConstant } from "app/shared/constant/CommonConstant";
import { LtkmCustAddrObj } from "app/shared/model/ltkm/ltkm-cust-addr-obj.model";


export class InputCustomAddrLtkmObj{
    LtkmCustId: number;
    LtkmCustAddrId: number;
    MrCustTypeCode: string;
    Mode: string;
    IsDetail: boolean;
    ListInputedAddr: Array<LtkmCustAddrObj>;
    InputedAddr: LtkmCustAddrObj;
    EditedIndex: number;
    constructor()
    {
        this.LtkmCustId = 0;
        this.LtkmCustAddrId = 0;
        this.MrCustTypeCode = CommonConstant.CustTypePersonal;
        this.Mode = "Add";
        this.IsDetail = false;
        this.ListInputedAddr = new Array<LtkmCustAddrObj>();
        this.InputedAddr = new LtkmCustAddrObj();
        this.EditedIndex = 0;
    }
}
