export class RequestSubmitMouCustDupCheckObj {
    AppGuarantorIds: Array<number>;
    AppCustPersonalContactPersonIds: Array<number>;
    AppCustCompanyMgmntShrholderIds: Array<number>;
    MouGuarantorIds: Array<number>;
    MouCustPersonalContactPersonIds: Array<number>;
    MouCustCompanyMgmntShrholderIds: Array<number>;
    CustNo: string;
    MouCustId: number;
    WfTaskListId: number;
    RowVersion: string;

    constructor() {
        this.AppGuarantorIds = new Array<number>();
        this.AppCustPersonalContactPersonIds = new Array<number>();
        this.AppCustCompanyMgmntShrholderIds = new Array<number>();
        this.MouGuarantorIds = new Array<number>();
        this.MouCustPersonalContactPersonIds = new Array<number>();
        this.MouCustCompanyMgmntShrholderIds = new Array<number>();
        this.RowVersion = "";
    }
}
