export class ReqAddNapObj {
    OriOfficeCode: string;
    OriOfficeName: string;
    CrtOfficeCode: string;
    CrtOfficeName: string;
    ProdOfferingCode: string;
    ProdOfferingName: string;
    ProdOfferingVersion: string;
    CurrCode: string;
    LobCode: string;
    RefProdTypeCode: string;
    PayFreqCode: string;
    BizTemplateCode: string;
    RowVersion: string;

    constructor() {
        this.OriOfficeCode = "";
        this.OriOfficeName = "";
        this.CrtOfficeCode = "";
        this.CrtOfficeName = "";
        this.ProdOfferingCode = "";
        this.ProdOfferingName = "";
        this.ProdOfferingVersion = "";
        this.CurrCode = "";
        this.LobCode = "";
        this.RefProdTypeCode = "";
        this.PayFreqCode = "";
        this.BizTemplateCode = "";
        this.RowVersion = "";
    }
}

export class ReqAddNapFromCopyObj {
    AppNo: string;
    OriOfficeCode: string;
    RowVersion: string;
    LobCode: string;
    ProdOfferingCode: string;
    ProdOfferingName: string;
    ProdOfferingVersion: string;
    CurrCode: string;
    RefProdTypeCode: string;
    PayFreqCode: string;
    constructor() {
        this.AppNo = "";
        this.OriOfficeCode = "";
        this.RowVersion = "";
        this.LobCode = "";
        this.ProdOfferingCode = "";
        this.ProdOfferingName = "";
        this.ProdOfferingVersion = "";
        this.CurrCode = "";
        this.RefProdTypeCode = "";
        this.PayFreqCode = "";
    }
}