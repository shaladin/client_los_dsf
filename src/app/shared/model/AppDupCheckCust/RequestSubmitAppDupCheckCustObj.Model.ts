
export class RequestSubmitAppDupCheckCustObj {
    AppGuarantorIds: Array<number>;
    AppCustPersonalContactPersonIds: Array<number>;
    AppCustCompanyMgmntShrholderIds: Array<number>;
    CustNo: string;
    RowVersion: string;

    constructor() {
        this.AppGuarantorIds = new Array<number>();
        this.AppCustPersonalContactPersonIds = new Array<number>();
        this.AppCustCompanyMgmntShrholderIds = new Array<number>();
        this.RowVersion = "";
    }
}
