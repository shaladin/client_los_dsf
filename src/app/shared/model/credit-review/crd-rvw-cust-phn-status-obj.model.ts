import { CommonConstant } from "app/shared/constant/CommonConstant";

export class CrdRvwCustPhnStatusObj {

    CrdRvwCustPhnStatusId: number;
    CrdRvwCustInfoId: number;
    PhnNo: string;
    PhnIndicator: string;
    PhnIndicatorDescr: string;
    RowVersion: string;

    constructor() {
        this.PhnIndicator = CommonConstant.WhiteIndicator;
        this.PhnIndicatorDescr = CommonConstant.NoData;
    }
}