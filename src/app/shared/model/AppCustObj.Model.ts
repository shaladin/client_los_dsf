export class AppCustObj {
    AppCustId: number;
    AppId: number;
    CustNo: string;
    CustName: string;
    MrCustTypeCode: string;
    CustModelCode: string;
    MrIdTypeCode: string;
    IdNo: string;
    IdExpiredDt: Date;
    TaxIdNo: string;
    IsVip: boolean;
    IsAppCustChecked: boolean;
    IsAffiliateWithMf: boolean;
    CustNotes: string;
    IsExistingCust: boolean;
    IsCustomer: boolean;
    IsFamily: boolean;
    IsGuarantor: boolean;
    IsShareholder: boolean;
    IsAffiliateWithMF: boolean;
    MrCustRelationshipCode: string;
    VipNotes: string;
    Age: number;
    RowVersion: any;

constructor() { 
        this.AppCustId = 0; 
        this.AppId = 0;
        this.CustNo = "";
        this.CustName = "";
        this.MrCustTypeCode = "";
        this.CustModelCode = "";
        this.MrIdTypeCode = "";
        this.IdNo = "";
        this.TaxIdNo = "";
        this.IsVip = false;
        this.IsAppCustChecked = false;
        this.IsAffiliateWithMf = false;
        this.CustNotes = "";
        this.IsCustomer = false;
        this.IsFamily = false;
        this.IsGuarantor = false;
        this.IsShareholder = false;
        this.IsAffiliateWithMF = false;
        this.MrCustRelationshipCode = "";
        this.VipNotes = "";
    }
}
