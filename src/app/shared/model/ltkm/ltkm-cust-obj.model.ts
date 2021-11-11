export class LtkmCustObj {
    LtkmCustId: number;
    AppId: number;
    CustNo: string;
    CustName: string;
    MrCustTypeCode: string;
    MrCustModelCode: string;
    MrIdTypeCode: string;
    IdNo: string;
    IdExpiredDt: Date;
    TaxIdNo: string;
    IsVip: boolean;
    IsAppCustChecked: boolean;
    IsAffiliateWithMf: boolean;
    IsExistingCust: boolean;
    IsCustomer: boolean;
    IsFamily: boolean;
    IsGuarantor: boolean;
    IsShareholder: boolean;
    IsCompletion: boolean;
    IsAffiliateWithMF: boolean;
    MrCustRelationshipCode: string;
    VipNotes: string;
    Age: number;
    RowVersion: string;

    constructor() {
        this.LtkmCustId = 0;
        this.AppId = 0;
        this.CustNo = "";
        this.CustName = "";
        this.MrCustTypeCode = "";
        this.MrCustModelCode = "";
        this.MrIdTypeCode = "";
        this.IdNo = "";
        this.TaxIdNo = "";
        this.IsVip = false;
        this.IsAppCustChecked = false;
        this.IsAffiliateWithMf = false;
        this.IsCustomer = false;
        this.IsFamily = false;
        this.IsGuarantor = false;
        this.IsShareholder = false;
        this.IsCompletion = false;
        this.IsAffiliateWithMF = false;
        this.MrCustRelationshipCode = "";
        this.VipNotes = "";
    }
}
