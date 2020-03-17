export class AppCustObj {
    AppCustId: any;
    AppId: any;
    CustNo: any;
    CustName: any;
    MrCustTypeCode: any;
    CustModelCode: any;
    MrIdTypeCode: any;
    IdNo: any;
    IdExpiredDt: any;
    TaxIdNo: any;
    IsVip: any;
    IsAppCustChecked: any;
    IsAffiliateWithMf: any;
    CustNotes: any;

constructor() { 
        this.AppCustId = 0; 
        this.AppId = 0;
        this.CustNo = "";
        this.CustName = "";
        this.MrCustTypeCode = "";
        this.CustModelCode = "";
        this.MrIdTypeCode = "";
        this.IdNo = "";
        this.IdExpiredDt = "";
        this.TaxIdNo = "";
        this.IsVip = false;
        this.IsAppCustChecked = false;
        this.IsAffiliateWithMf = false;
        this.CustNotes = "";
    }
}
