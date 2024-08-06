import { CustAddrXObj } from "./cust-addr-x-obj.model";

export class CustXObj {
    CustId: number;
    CustNo: string;
    CustName: string;
    MrCustTypeCode: string;
    MrCustModelCode: string;
    MrIdTypeCode: string;
    IdNo: string;
    IdExpiredDt: Date;
    TaxIdNo: string;
    IsVip: boolean;
    IsAffiliateWithMf: boolean;
    VipNotes: string;
    OriginalOfficeCode: string;
    RowVersion: string;
    CustAddr: CustAddrXObj;
    IsCustomer: boolean;
    IsFamily: boolean;
    IsGuarantor: boolean;
    IsShareholder: boolean;
    ThirdPartyTrxNo: string;
    ThirdPartyGroupTrxNo: string;

    constructor() {
        this.CustId = 0;
        this.CustAddr = new CustAddrXObj();
        this.IsCustomer = false;
        this.IsFamily = false;
        this.IsGuarantor = false;
        this.IsShareholder = false;
        this.CustNo = "";
        this.ThirdPartyTrxNo = "";
        this.ThirdPartyGroupTrxNo = "";
        this.RowVersion = "";
    }
}